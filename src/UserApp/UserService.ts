import UserRepository from "./UserRepository"
import { User, UserCreate } from "./types"
import { IOkWithData ,IError, IOk } from "../types/types"
import { hash , compare } from "bcryptjs"
import { SECRET_KEY } from "../config/token";
import { sign } from "jsonwebtoken";

async function authLogin(email: string, password: string): Promise<IOkWithData<string> | IError> {
    const user = await UserRepository.findUserByEmail(email);

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


async function getUserById (id : number):Promise <IOkWithData<User> | IError>{
    const user = await UserRepository.findUserById(id)
    if (!user){
        return { status: "error", message: "user not found" };
    }
    if (typeof user === "string") {
        return { status: "error", message: user };
    }
    return {status : "ok" , data: user}
}



async function authRegistration(userData: UserCreate): Promise<IOkWithData<string> | IError> {
    const user = await UserRepository.findUserByEmail(userData.email);
        
    if (user) {
        return { status: "error", message: "user not users" };
    }

    if (typeof user === "string") {
        return { status: "error", message: user };
    }

    const hashedPassword = await hash(userData.password, 10)
    
    const hashedUserData = {
        ...userData ,
        password: hashedPassword
    }

    const newUser = await UserRepository.createUser(hashedUserData);
    if (typeof newUser === "string") {
        return { status: "error", message: newUser };
    }

    if (!newUser) {
        return { status: "error", message: "User is not user" };
    }

    const token = sign({id: newUser.id}, SECRET_KEY, { expiresIn: "1d" })

    return { status: "ok", data: token };
}

const userService = {
    authLogin: authLogin,
    authRegistration: authRegistration,
    getUserById :getUserById 
}

export default userService