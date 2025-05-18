import UserNativeRepository from "./UserNativeRepository";
import { UserNative, UserNativeCreate } from "./types";
import { IOkWithData, IError, IOk } from "../types/types";
import { hash, compare } from "bcryptjs";
import { SECRET_KEY } from "../config/token";
import { sign } from "jsonwebtoken";
import { generateVerificationCode, sendVerificationEmail } from "./emailUtility";

async function authLogin(email: string, password: string): Promise<IOkWithData<string> | IError> {
    const user = await UserNativeRepository.findUserByEmail(email);
    
    if (!user) return { status: "error", message: "User not found" };
    if (typeof user === "string") return { status: "error", message: user };
    if (!user.isVerified) return { status: "error", message: "Email not verified" };

    const isMatch = await compare(password, user.password);
    if (!isMatch) return { status: "error", message: "Invalid password" };

    const token = sign({ id: user.id }, SECRET_KEY, { expiresIn: "1d" });
    return { status: "ok", data: token };
}

async function getUserById(id: number): Promise<IOkWithData<UserNative> | IError> {
    const user = await UserNativeRepository.findUserById(id);
    if (!user) return { status: "error", message: "User not found" };
    if (typeof user === "string") return { status: "error", message: user };
    return { status: "ok", data: user };
}

async function startRegistration(userData: UserNativeCreate): Promise<IOk | IError> {
    const existingUser = await UserNativeRepository.findUserByEmail(userData.email);
    
    // Если пользователь уже существует и верифицирован
    if (existingUser && typeof existingUser !== "string" && existingUser.isVerified) {
        return { status: "error", message: "Email уже используется" };
    }

    const code = generateVerificationCode();
    const hashedPassword = await hash(userData.password, 10);

    // Удаляем старые коды для этого email
    await UserNativeRepository.deleteUnverifiedUser(userData.email);

    // Создаем нового пользователя с кодом подтверждения
    const newUser = await UserNativeRepository.createUser({
        email: userData.email,
        password: hashedPassword,
        isVerified: false,
        verificationCode: code,
        verificationCodeCreatedAt: new Date() // Добавляем время создания кода
    });

    if (typeof newUser === "string") {
        return { status: "error", message: newUser };
    }

    await sendVerificationEmail(userData.email, code);
    return { status: "ok", message: "Код подтверждения отправлен на email" };
}

async function completeRegistration(email: string, code: string): Promise<IOkWithData<string> | IError> {
    // Находим неверифицированного пользователя
    const user = await UserNativeRepository.findUnverifiedUserByEmail(email);
    
    if (!user) {
        return { status: "error", message: "Пользователь не найден или уже верифицирован" };
    }

    // Проверяем срок действия кода (15 минут)
    const codeExpirationTime = 15 * 60 * 1000; // 15 минут в миллисекундах
    const currentTime = new Date();
    const codeCreationTime = user.verificationCodeCreatedAt || new Date(0);
    
    if (currentTime.getTime() - codeCreationTime.getTime() > codeExpirationTime) {
        return { status: "error", message: "Срок действия кода истек" };
    }

    // Проверяем совпадение кода
    if (user.verificationCode !== code) {
        return { status: "error", message: "Неверный код подтверждения" };
    }

    // Верифицируем пользователя
    const verifiedUser = await UserNativeRepository.verifyUser(email);
    if (!verifiedUser) {
        return { status: "error", message: "Ошибка верификации" };
    }

    const token = sign({ id: verifiedUser.id }, SECRET_KEY, { expiresIn: "1d" });
    return { status: "ok", data: token };
}

const userNativeService = {
    authLogin,
    getUserById,
    startRegistration,
    completeRegistration,
};

export default userNativeService;