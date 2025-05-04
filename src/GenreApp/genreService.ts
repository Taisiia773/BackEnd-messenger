import genreRepository  from "./genreRepository"


interface Genre{
    id:number
    name:string
    description:string 
}

interface ICategoryOk{
    status: "ok",
    genre: Genre[]
}

interface ICategoryError{
    status:"error",
    message: string
}

async function getAllGenres(max?: number): Promise<ICategoryOk | ICategoryError> {
    const genre = await genreRepository.getAllGenres()
    if (!genre){
        return{status: "error", message: "vsekapec"}
    }
    return {status:"ok", genre: genre}
}


const genreService = {
    getAllGenres
}

export default genreService
