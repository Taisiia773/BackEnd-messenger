import { Router } from "express"
import userNativeControllerApi from "./UserNativeControllerApi"
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware"

const userApiRouter = Router()

userApiRouter.post("/registration/start", userNativeControllerApi.startRegistration)
userApiRouter.post("/registration/complete", userNativeControllerApi.completeRegistration)
userApiRouter.post("/login", userNativeControllerApi.authUser)
userApiRouter.get("/me", authTokenMiddleware, userNativeControllerApi.getUser)

export default userApiRouter