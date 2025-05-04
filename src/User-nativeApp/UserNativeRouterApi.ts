import {Router} from "express" 
import userNativeControllerApi from "./UserNativeControllerApi"
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware"
const userApiRouter = Router()

userApiRouter.post("/registration", userNativeControllerApi.registerUser)
userApiRouter.post("/login", userNativeControllerApi.authUser)
userApiRouter.get("/me" , authTokenMiddleware , userNativeControllerApi.getUser)


export default userApiRouter