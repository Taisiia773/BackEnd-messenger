import dotenv from 'dotenv';

dotenv.config();

export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'fallback_weak_secret_dev_only',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000, // 15 минут
    httpOnly: true,
    sameSite: 'lax' as const
  }
};