import { Prisma } from "@prisma/client";

export type UserNative = Prisma.UserNativeGetPayload<{
    select: {
        email: true
        id: true
        isVerified: true
    }
}>;

export type UserNativeCreate = {
    email: string;
    password: string;
    isVerified?: boolean;
};
