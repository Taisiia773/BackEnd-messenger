import { client } from "../client/prismaClient"
import { Prisma } from "@prisma/client"


async function getAllGenres(){
    try {
        const genres = await client.genre.findMany()
        return genres
    } catch(err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError){
            if (err.code === "P2002"){
                console.log(err.message)
                throw err
            } else if ( err.code === "P2003"){
                console.log(err.message)
                throw err
            } else if ( err.code === "P2007"){
                console.log(err.message)
                throw err
            } else if ( err.code === "P2014"){
                console.log(err.message)
                throw err
            }
    }
}}


const genreRepository = {
    getAllGenres
}

export default genreRepository