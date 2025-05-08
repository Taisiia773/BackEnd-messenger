import UserNativeRepository from "./UserNativeRepository"
import { UserNative, UserNativeCreate } from "./types"
import { IOkWithData ,IError, IOk } from "../types/types"
import { hash , compare } from "bcryptjs"
import { SECRET_KEY } from "../config/token";
import { sign } from "jsonwebtoken";
import { generateVerificationCode, sendVerificationEmail } from "./emailUtility";

async function authLogin(email: string, password: string): Promise<IOkWithData<string> | IError> {
    const user = await UserNativeRepository.findUserByEmail(email);

    if (!user) {
        return { status: "error", message: "User not users" };
    }
    if (typeof user === "string") {
        return { status: "error", message: user };
    }
    const isMatch = await compare(password, user.password)

    if (!isMatch) {
        return { status: "error", message: "Passwords are not passwords" };
    }

    const token = sign({id: user.id}, SECRET_KEY, { expiresIn: "1d" })

    return { status: "ok", data: token };
}


async function getUserById (id : number):Promise <IOkWithData<UserNative> | IError>{
    const user = await UserNativeRepository.findUserById(id)
    if (!user){
        return { status: "error", message: "user not found" };
    }
    if (typeof user === "string") {
        return { status: "error", message: user };
    }
    return {status : "ok" , data: user}
}



async function authRegistration(userData: UserNativeCreate): Promise<IOkWithData<string> | IError> {
    const user = await UserNativeRepository.findUserByEmail(userData.email);
        
    if (user) {
        return { status: "error", message: "user not users" };
    }

    if (typeof user === "string") {
        return { status: "error", message: user };
    }

    const hashedPassword = await hash(userData.password, 10)
    
    const hashedUserData = {
        ...userData ,
        password: hashedPassword,
        isVerified: false
    }

    const newUser = await UserNativeRepository.createUser(hashedUserData);
    if (typeof newUser === "string") {
        return { status: "error", message: newUser };
    }

    if (!newUser) {
        return { status: "error", message: "User is not user" };
    }

    const token = sign({id: newUser.id}, SECRET_KEY, { expiresIn: "1d" })

    return { status: "ok", data: token };
}

export async function sendVerificationCode(email: string) {
    const user = await UserNativeRepository.findUserByEmail(email);

    if (!user || typeof user === "string") {
        return { status: "error", message: "Пользователь не найден" };
    }

    const code = generateVerificationCode(); // Генерируем код
    const updatedUser = await UserNativeRepository.updateVerificationCode(email, code);

    if (!updatedUser) {
        return { status: "error", message: "Не удалось сохранить код подтверждения" };
    }

    await sendVerificationEmail(email, code); // Отправляем код на email
    return { status: "success", message: "Код отправлен на email" };
}

export async function verifyCode(email: string, code: string) {
    const user = await UserNativeRepository.findUserByEmail(email);

    if (!user || typeof user === "string") {
        return { status: "error", message: "Пользователь не найден" };
    }

    if (!user.verificationCode) {
        return { status: "error", message: "Код подтверждения отсутствует" };
    }

    if (user.verificationCode !== code) {
        return { status: "error", message: "Неверный код подтверждения" };
    }

    const updatedUser = await UserNativeRepository.updateVerificationStatus(email, true);

    if (!updatedUser) {
        return { status: "error", message: "Не удалось обновить статус верификации" };
    }

    return { status: "success", message: "Email успешно подтвержден" };
}

const userNativeService = {
    authLogin: authLogin,
    authRegistration: authRegistration,
    getUserById :getUserById,
    verifyCode: verifyCode,
    sendVerificationCode: sendVerificationCode,
}

export default userNativeService