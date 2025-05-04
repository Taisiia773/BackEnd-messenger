import { client, getErrorMessage } from "../client/prismaClient"
import { Prisma } from "@prisma/client"

async function findUserByEmail(email: string) {
    try {
        console.log(email)
        const user = await client.user.findUnique({
            where: {
                email: email
            }
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

async function createUser(data: Prisma.UserCreateInput) {
    try {
        console.log(data)
        const user = await client.user.create({
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
        const user = await client.user.findUnique({
            where:{
                id :id
            },
            select: {
                username: true, 
                email: true, 
                id: true,
                role: true,
                image: true,
                age: true
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

const UserRepository = {
    findUserByEmail,
    createUser, 
    findUserById
}

export default UserRepository