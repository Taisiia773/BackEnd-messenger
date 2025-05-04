import userNativeService from "./UserNativeService"
import { Request, Response } from "express"

async function authUser(req : Request , res : Response){
    const data = req.body
    const result = await userNativeService.authLogin(data.email, data.password)
    res.json(result) 
}

async function registerUser(req : Request , res : Response){
    const data = req.body
    const result = await userNativeService.authRegistration(data)
    res.json(result)
}
async function getUser(req : Request , res : Response){
    const userId = res.locals.userId
    const result = await userNativeService.getUserById(userId)
    res.json(result)
}


const userNativeControllerApi = {
    registerUser: registerUser,
    authUser: authUser,
    getUser: getUser
}
export default userNativeControllerApi

