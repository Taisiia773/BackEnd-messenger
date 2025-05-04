import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken"
import { SECRET_KEY } from "../config/token"

interface IToken {
    exp: number, 
    iat: number,
    id: number
}


export function authTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization
    if (!authorization) {
        res.status(401).json({status: "error", message: "Authorization required"})
        return 
    }
    const [type, token] = authorization.split(" ")
    if (!token || type != "Bearer") {
        res.status(401).json({status: "error", message: "Authorization format is invalid"})
        return
    }
    try {
        const decodedToken = verify(token, SECRET_KEY) as IToken
        res.locals.userId = decodedToken.id
        next()
    }
    catch (error) {
        res.status(401).json({status: "error", message: "Token error"})
    }

}