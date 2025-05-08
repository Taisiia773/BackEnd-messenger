import { Prisma } from "@prisma/client"

export type UserNative = Prisma.UserNativeGetPayload<{
    select: {
        username: true, 
        email: true, 
        id: true,
        isVerified: true
    }
}>
export type UserNativeCreate = Prisma.UserNativeUncheckedCreateInput & {
    isVerified?: boolean
    verificationCode?: string
}