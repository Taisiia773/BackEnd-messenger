import express from 'express';
import { PrismaClient, UserNative } from '@prisma/client';
import { authTokenMiddleware } from '../middlewares/authTokenMiddleware';

declare global {
  namespace Express {
    interface Request {
      user?: UserNative;
    }
  }
}

const prisma = new PrismaClient();
const postsRouter = express.Router();

// Создание поста (требует авторизации)
postsRouter.post('/', authTokenMiddleware, async (req, res) => {
  try {
    const { title, description, topic, url } = req.body;
    const userId = req.user?.id; // ID из вашего middleware
    console.log('req.body', req.body);
    console.log('req.user', req.user);

    if (!userId) {
      res.status(400).json({ status: 'error', message: 'Пользователь не авторизован' });
      return;
    }

    const post = await prisma.post.create({
      data: {
        title,
        description,
        topic: topic || null,
        url: url || null,
        userId,
      },
    });
    res.status(201).json(post);
    return;
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Ошибка при создании поста' });
  }
});

// Получение всех постов (публичное)
postsRouter.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { id: true, email: true } }, // Данные автора
        _count: { select: { likes: true, views: true } }, // Кол-во лайков/просмотров
      },
      orderBy: { createdAt: 'desc' }, // Сортировка по дате
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Ошибка при получении постов' });
  }
});

// Лайк поста (требует авторизации)
postsRouter.post('/:postId/like', authTokenMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ status: 'error', message: 'Пользователь не авторизован' });
            return;
        }

        // Проверяем, не лайкал ли уже
        const existingLike = await prisma.like.findFirst({
            where: { userId, postId: Number(postId) },
        });

        if (existingLike) {
            res.status(400).json({ status: 'error', message: 'Вы уже лайкнули этот пост' });
            return;
        }

        const like = await prisma.like.create({
            data: { userId, postId: Number(postId) },
        });

        res.status(201).json(like);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Ошибка при лайке' });
    }
});

// Учет просмотра (публичный, но сохраняет user_id если есть токен)
postsRouter.post('/:postId/view', async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id; // Опционально из middleware

    await prisma.view.create({
      data: {
        postId: Number(postId),
        userId: userId || null, // null для анонимных
      },
    });

    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Ошибка при учете просмотра' });
  }
});

export default postsRouter;