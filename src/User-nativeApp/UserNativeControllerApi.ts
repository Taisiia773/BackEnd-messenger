import { Request, Response } from "express";
import userNativeService from "./UserNativeService";

async function authUser(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await userNativeService.authLogin(email, password);
    res.json(result);
}

async function startRegistration(req: Request, res: Response) {
    const data = req.body;
    // Убираем передачу req, так как он больше не нужен
    const result = await userNativeService.startRegistration(data);
    res.json(result);
}

async function completeRegistration(req: Request, res: Response) {
    const { email, code } = req.body;
    // Убираем передачу req, так как он больше не нужен
    const result = await userNativeService.completeRegistration(email, code);
    res.json(result);
}

async function getUser(req: Request, res: Response) {
    const userId = res.locals.userId;
    const result = await userNativeService.getUserById(userId);
    res.json(result);
}

const userNativeControllerApi = {
    authUser,
    startRegistration,
    completeRegistration,
    getUser,
};

export default userNativeControllerApi;