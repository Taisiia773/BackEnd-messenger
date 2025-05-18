import crypto from "crypto";
import nodemailer from "nodemailer";

// Генерация случайного кода подтверждения (6 цифр)
export const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-значный код
};

// Настройка транспортера для отправки email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "catogramcorp@gmail.com", // Ваш email
        pass: "kzpp enjq ifkr prup",   // Пароль приложения
    },
    tls: {
        rejectUnauthorized: false // Отключает проверку сертификата
    }
});

// Функция для отправки email с кодом подтверждения
export const sendVerificationEmail = async (email: string, code: string) => {
    try{
        await transporter.sendMail({
            from: '"Cato gram" <catogramcorp@gmail.com>',
            to: email,
            subject: "Код подтверждения",
            html: `<p>Ваш код подтверждения: <strong>${code}</strong></p>`,
        });
}catch (err) {
    console.error("Error sending email:", err);
    throw err;
}
};