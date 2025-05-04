import {Router} from "express" 
import userControllerApi from "./UserControllerApi"
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware"
const userApiRouter = Router()

userApiRouter.post("/registration", userControllerApi.registerUser)
userApiRouter.post("/login", userControllerApi.authUser)
userApiRouter.get("/me" , authTokenMiddleware , userControllerApi.getUser)


export default userApiRouter