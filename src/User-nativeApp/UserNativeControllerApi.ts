import { Request, Response } from "express"
import userNativeService from "./UserNativeService"

async function authUser(req: Request, res: Response) {
    const { email, password } = req.body
    const result = await userNativeService.authLogin(email, password)
    res.json(result)
}

async function startRegistration(req: Request, res: Response) {
    const data = req.body
    const result = await userNativeService.startRegistration(req, data)
    res.json(result)
    console.log(result)
}

async function completeRegistration(req: Request, res: Response) {
    const { code } = req.body
    const result = await userNativeService.completeRegistration(req, code)
    res.json(result)
    console.log(result)
}

async function getUser(req: Request, res: Response) {
    const userId = res.locals.userId
    const result = await userNativeService.getUserById(userId)
    res.json(result)
}

const userNativeControllerApi = {
    authUser,
    startRegistration,
    completeRegistration,
    getUser
}

export default userNativeControllerApi