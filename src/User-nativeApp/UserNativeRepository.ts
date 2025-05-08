import { client, getErrorMessage } from "../client/prismaClient"
import { Prisma } from "@prisma/client"


async function findUserByEmail(email: string) {
    try {
        const user = await client.userNative.findUnique({
            where: {
                email: email
            },
            select: {
                username: true,
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
        console.log(data)
        const user = await client.userNative.create({
            data: data
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

async function findUserById (id : number) {
    try {
        const user = await client.userNative.findUnique({
            where:{
                id :id
            },
            select: {
                username: true, 
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

async function updateVerificationStatus(email: string, isVerified: boolean) {
    try {
        return await client.userNative.update({
            where: { email },
            data: { isVerified },
        });
    } catch (err) {
        console.error(err);
        return null;
    }
}

const UserNativeRepository = {
    findUserByEmail,
    createUser, 
    findUserById,
    updateVerificationCode,
    updateVerificationStatus
}

export default UserNativeRepository