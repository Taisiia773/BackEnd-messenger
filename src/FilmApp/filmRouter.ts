import express from "express"
import filmController from "./filmController"


const router = express.Router()

router.get("/all", filmController.getAllFilms)
router.get("/:id", filmController.getFilmById)


export default router