import { client } from "../client/prismaClient"
import { Prisma } from "@prisma/client"



async function getFilmById(id: number){
    const film = await client.film.findUnique({
        where: {
            id: id
        }
    })
    return film
}



async function getAllFilms() {
    try {
        return await client.film.findMany()
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError){
            if (err.code === "P2002"){
                console.log(err.message)
                throw err
            } else if ( err.code === "P2003"){

            }
        }
    }
}


const filmRepository = {
    getFilmById, 
    getAllFilms
}

export default filmRepository