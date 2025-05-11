import { Prisma } from "@prisma/client"

export type UserNative = Prisma.UserNativeGetPayload<{
    select: {
        email: true
        id: true
        isVerified: true
    }
}>

export type UserNativeCreate = Prisma.UserNativeUncheckedCreateInput & {
    isVerified?: boolean
}

export interface TempRegistrationData {
    email: string
    password: string
    verificationCode: string
    createdAt: number
    attempts: number
}