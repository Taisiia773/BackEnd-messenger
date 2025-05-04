import express from "express"
import genreController from "./genreController"

const router = express.Router()

router.get("/all", genreController.getAllGenres)

export default router