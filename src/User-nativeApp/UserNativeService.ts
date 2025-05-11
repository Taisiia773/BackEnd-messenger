import UserNativeRepository from "./UserNativeRepository"
import { UserNative, UserNativeCreate } from "./types"
import { IOkWithData, IError, IOk } from "../types/types"
import { hash, compare } from "bcryptjs"
import { SECRET_KEY } from "../config/token"
import { sign } from "jsonwebtoken"
import { generateVerificationCode, sendVerificationEmail } from "./emailUtility"
import { Request } from "express"

interface TempRegistrationData {
    email: string
    password: string
    verificationCode: string
    createdAt: number
    attempts: number
}

declare module 'express-session' {
    interface SessionData {
        tempRegistration?: TempRegistrationData;
    }
}

async function authLogin(email: string, password: string): Promise<IOkWithData<string> | IError> {
    const user = await UserNativeRepository.findUserByEmail(email)
    
    if (!user) return { status: "error", message: "User not found" }
    if (typeof user === "string") return { status: "error", message: user }
    if (!user.isVerified) return { status: "error", message: "Email not verified" }

    const isMatch = await compare(password, user.password)
    if (!isMatch) return { status: "error", message: "Invalid password" }

    const token = sign({ id: user.id }, SECRET_KEY, { expiresIn: "1d" })
    return { status: "ok", data: token }
}

async function getUserById(id: number): Promise<IOkWithData<UserNative> | IError> {
    const user = await UserNativeRepository.findUserById(id)
    if (!user) return { status: "error", message: "User not found" }
    if (typeof user === "string") return { status: "error", message: user }
    return { status: "ok", data: user }
}

async function startRegistration(req: Request, userData: UserNativeCreate): Promise<IOk | IError> {
    const existingUser = await UserNativeRepository.findUserByEmail(userData.email)
    if (existingUser && typeof existingUser !== "string") {
        return { status: "error", message: "Email already in use" }
    }

    const code = generateVerificationCode()
    
    req.session.tempRegistration = {
        email: userData.email,
        password: userData.password,
        verificationCode: code,
        createdAt: Date.now(),
        attempts: 0
    }

    await sendVerificationEmail(userData.email, code)
    return { status: "ok", message: "Verification code sent to email" }
}

async function completeRegistration(req: Request, code: string): Promise<IOkWithData<string> | IError> {
    const tempReg = req.session.tempRegistration as TempRegistrationData
    
    if (!tempReg) {
        return { status: "error", message: "Registration session expired" }
    }
    
    tempReg.attempts++
    if (tempReg.attempts > 3) {
        delete req.session.tempRegistration
        return { status: "error", message: "Too many attempts" }
    }
    
    if (Date.now() - tempReg.createdAt > 15 * 60 * 1000) {
        delete req.session.tempRegistration
        return { status: "error", message: "Code expired" }
    }
    
    if (tempReg.verificationCode !== code) {
        return { status: "error", message: "Invalid code" }
    }
    
    const hashedPassword = await hash(tempReg.password, 10)
    const newUser = await UserNativeRepository.createUser({
        email: tempReg.email,
        password: hashedPassword,
        isVerified: true
    })
    
    if (typeof newUser === "string") {
        return { status: "error", message: newUser }
    }

    delete req.session.tempRegistration
    const token = sign({ id: newUser.id }, SECRET_KEY, { expiresIn: "1d" })
    return { status: "ok", data: token }
}

const userNativeService = {
    authLogin,
    getUserById,
    startRegistration,
    completeRegistration
}

export default userNativeService