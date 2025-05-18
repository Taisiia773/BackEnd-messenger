import express, { Request, Response } from "express";
import { sessionConfig } from './config/session'
import { PrismaClient } from "@prisma/client";
import session from 'express-session'
import dotenv from 'dotenv'
import * as z from "zod";

import path from "path";
import UserRouterApi from "./UserApp/UserRouterApi";
import UserNativeRouterApi from "./User-nativeApp/UserNativeRouterApi";
import postsRouter from "./UserPosts/UserPostsRoutes";
const prisma = new PrismaClient()
dotenv.config()


const HOST = '172.20.10.7'
const PORT = 5000


const app = express()
const cors = require('cors')

app.use(session(sessionConfig))

app.use(express.json())
app.use(cors())

app.set("view engine", "ejs")

app.set("views", path.resolve(__dirname, "./templates"))
app.use("/static/", express.static(path.resolve(__dirname, "./static")))

// app.use("/film", filmRouter)
// app.use("/genre/", genreRouter)

const genreSchema = z.object({
  name: z.string().min(2, "Название должно быть не менее 2 символов"),
  description: z.string().min(5, "Описание должно быть не менее 5 символов"),
});

app.get("/", (req: Request ,res: Response) => {
    res.render("main")
})

app.use("/api/user", UserRouterApi)

app.use("/api/usernative", UserNativeRouterApi)

app.use("/api/posts", postsRouter);




app.get('/genres', async (req, res) => {
    try {
      const genres = await prisma.genre.findMany();
      res.json(genres);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch genre' });
    }
  })

  app.get('/genre/:id', async (req, res) => {
    try {
      const genre = await prisma.genre.findUnique({
        where: {
          id: Number(req.params.id)
        }
      })
      res.json(genre)
    } catch (err) {
      res.status(500).json({ error: 'Failed to find genre' });
    }
  })

  // app.post("/genres", async (req, res) => {
  //   try {
  //     const parsedData = genreSchema.parse(req.body);
  //     const newGenre = await prisma.genre.create({ data: parsedData });
  //     res.status(201).json(newGenre);
  //   } catch (error) {
  //     if (error instanceof z.ZodError) {
  //       const validationErrors: z.ZodIssue[] = error.errors;
  //       return res.status(200).json(validationErrors);
  //     }
  //     res.status(500).json({ error: "Ошибка при создании жанра" });
  //   }
  // });
  


  app.get('/films', async (req, res) => {
    try {
      const movies = await prisma.film.findMany();
      res.json(movies);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch movies' });
    }
  })

  app.get('/film/:id', async (req, res) => {
    try {
      const film = await prisma.film.findUnique({
        where: {
          id: Number(req.params.id)
        }
      })
      res.json(film)
    } catch (err) {
      res.status(500).json({ error: 'Failed to find film' });
    }
  })

  app.get('/comment/:id', async (req, res) => {
    try {
      const comment = await prisma.comment.findUnique({
        where: {
          id: Number(req.params.id)
        }
      })
      res.json(comment)
    } catch (err) {
      res.status(500).json({ error: 'Failed to find comment' });
    }
  })

  app.get('/comments/:id', async (req, res) => {
    try {
      const comments = await prisma.comment.findMany({
        where: {
          filmId: Number(req.params.id)
        }
      })
      res.json(comments)
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  })

  app.patch('/api/film/:id', async (req, res)=>{
    const {id} = req.params
    const {name, rating, year, language, country, age, img, filmImage, actors, information, someFacts} = req.body

    try {
      const updatedItem = await prisma.film.update({
        where: {id: Number(id)},
        data:{
          name,
          rating,
          year,
          language,
          country,
          age,
          img,
          filmImage,
          actors,
          information,
          someFacts
        }
      })
      res.json(updatedItem)
    }catch(error){
      res.status(500).json({ error: 'Failed to update film' });
    }
  })

  app.patch('/api/genre/:id', async (req, res)=>{
    const {id} = req.params
    const {name, description} = req.body

    try {
      const updatedItem = await prisma.genre.update({
        where: {id: Number(id)},
        data:{
          name,
          description
        }
      })
      res.json(updatedItem)
    }catch(error){
      res.status(500).json({ error: 'Failed to update genre' });
    }
  })

  app.delete('/film/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Удаляем фильм по ID
      const deletedFilm = await prisma.film.delete({
        where: {
          id: Number(id),
        },
      });
  
      res.json({
        message: `Фильм с ID ${id} успешно удалён`,
        deletedFilm,
      });
    } catch (err) {
      // Обработка ошибки, если фильм не найден или произошла ошибка
      res.status(500).json({ error: `Не удалось удалить фильм с ID ${id}` });
    }
  });


  prisma.$connect()
  .then(() => console.log("✅ Подключение к БД успешно"))
  .catch((err) => console.error("❌ Ошибка БД:", err));

  app.listen(PORT, HOST, () => {
    console.log(`Listening on a port http://${HOST}:${PORT}`)
})

