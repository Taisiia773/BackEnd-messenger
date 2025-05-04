import express,{Express, Request, Response} from 'express'
import filmService from './filmService'

function getFilmById (req: Request, res : Response) {
    
    const id = +req.params.id
    const context = filmService.getFilmById(id)
    res.render('film', context)
}
async function getAllFilms(req: Request, res: Response){
    const max = req.query.max ? +req.query.max : undefined
    const film = String(req.query.film) || undefined
    const context = await filmService.getAllFilms(max, film)
    console.log(res.locals.user)
    res.render("films", context)
}


const filmController= {
    getFilmById, 
    getAllFilms
}

export default filmController