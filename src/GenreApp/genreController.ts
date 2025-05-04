import express,{Express, Request, Response} from 'express'
import genreService from './genreService'

async function getAllGenres (req: Request, res : Response) {
    const max = req.query.max ? +req.query.max : undefined
    const context = await genreService.getAllGenres(max)
    
    res.render("genres", context)
}


const genreController = {
    getAllGenres
}

export default genreController