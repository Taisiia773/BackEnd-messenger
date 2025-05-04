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

const UserNativeRepository = {
    findUserByEmail,
    createUser, 
    findUserById
}

export default UserNativeRepository