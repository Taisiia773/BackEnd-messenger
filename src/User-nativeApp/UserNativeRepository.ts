import { client, getErrorMessage } from "../client/prismaClient";
import { Prisma } from "@prisma/client";

async function findUserByEmail(email: string) {
    try {
        const user = await client.userNative.findUnique({
            where: { email },
            select: {
                email: true,
                password: true,
                id: true,
                isVerified: true,
                verificationCode: true,
            },
        });
        return user;
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            const errorMessage = getErrorMessage(err.code);
            console.log(errorMessage);
            return errorMessage;
        }
        console.log(err);
        return "error";
    }
}

async function createUser(data: Prisma.UserNativeCreateInput) {
    try {
        const user = await client.userNative.create({ data });
        return user;
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            const errorMessage = getErrorMessage(err.code);
            console.log(errorMessage);
            return errorMessage;
        }
        console.log(err);
        return "error";
    }
}

async function findUserById(id: number) {
    try {
        const user = await client.userNative.findUnique({
            where: { id },
            select: {
                email: true, 
                id: true,
                isVerified: true,
                verificationCode: true,
            },
        });
        return user;
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            const errorMessage = getErrorMessage(err.code);
            console.log(errorMessage);
            return errorMessage;
        }
        console.log(err);
        return "error";
    }
}

async function updateVerificationCode(email: string, code: string) {
    try {
        return await client.userNative.update({
            where: { email },
            data: { verificationCode: code },
        });
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function verifyUser(email: string) {
    try {
        return await client.userNative.update({
            where: { email },
            data: { 
                isVerified: true,
                verificationCode: null,
                verificationCodeCreatedAt: null
            }
        });
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function findUnverifiedUserByEmailAndCode(email: string, code: string) {
    try {
        return await client.userNative.findFirst({
            where: {
                email,
                verificationCode: code,
                isVerified: false,
            },
        });
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function findUnverifiedUserByEmail(email: string) {
    try {
        return await client.userNative.findFirst({
            where: {
                email,
                isVerified: false,
                verificationCode: { not: null }
            }
        });
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function deleteUnverifiedUser(email: string) {
    try {
        await client.userNative.deleteMany({
            where: {
                email,
                isVerified: false
            }
        });
    } catch (err) {
        console.error(err);
    }
}



const UserNativeRepository = {
    findUserByEmail,
    createUser, 
    findUserById,
    updateVerificationCode,
    verifyUser,
    findUnverifiedUserByEmailAndCode,
    findUnverifiedUserByEmail,
    deleteUnverifiedUser,
};

export default UserNativeRepository;