import filmRepository  from "./filmRepository"


interface Film{
    id: number
    name:string
    rating:number
    year:number
    language:string
    country:string
    age:number
}

interface IFilmOk{
    status: "ok",
    film: Film[]
}

interface IFilmError{
    status:"error",
    message: string
}

interface IOneElement{
    status: "ok",
    film: Film
}

async function getAllFilms(max?: number, film?: string): Promise<IFilmOk | IFilmError> {
    const films = await filmRepository.getAllFilms()
    if (!films){
        return{status: "error", message: "vsekapec"}
    }
    return {status:"ok", film: films}
}

async function getFilmById(id:number): Promise<IOneElement | IFilmError> {
    const film = await filmRepository.getFilmById(id)
    if (!film){
        return{status: "error", message: "vsekapec"}
    }
    return {status:"ok", film: film}
    
}


// async function getFilmWithGenre(id: number): Promise<IOneElement | IFilmError> {
//     const film = await filmRepository.getFilmWithGenre(id)
//     if (!film){
//         return{status: "error", message: "vsekapec"}
//     }
//     return {status:"ok", film: film}
// }


const filmService = {
    getAllFilms,
    getFilmById,
    // getFilmWithGenre
}

export default filmService