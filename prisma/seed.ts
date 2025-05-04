import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()


// Получение одного film
async function getFilm() {
    const film = await prisma.film.findUnique({
        where: {
            id: 1
        }
    })
    console.log(film)
}

// Получение all films
async function getFilms() {
    const films = await prisma.film.findMany()
    console.log(films)
}

async function getComments() {
  const comments = await prisma.comment.findMany()
  console.log(comments)
}

async function getCommentsList() {
  const genre = await prisma.comment.findUnique({
      where: {
          id: 1
      }
  })
  console.log(genre)
}

async function addComments(comments: {
    id: number
    userId: number
    text: string
    filmId: number
}[]) {
  for (const comment of comments) {
    await prisma.comment.create({
      data: comment,
    });
    console.log(`Comment "${comment.id}" added!`);
  }
}

// Получение all genres
async function getGenres() {
    const genres = await prisma.genre.findMany()
    console.log(genres)
}

async function getGenresList() {
  const genre = await prisma.genre.findUnique({
      where: {
          id: 1
      }
  })
  console.log(genre)
}

async function addGenres(genres: { name: string; description: string }[]) {
    for (const genre of genres) {
      await prisma.genre.create({
        data: genre,
      });
      console.log(`Genre "${genre.name}" added!`);
    }
  }

async function createUser(
  users:{
    username: string;
    email: string;
    password: string;
    image: string;
    age: string;
  }[] 
) {
  for (const user of users) {
    await prisma.user.create({
      data: user,
  });
  console.log(`user "${user.username}" added!`);
}}

async function addFilms(
films: {
    name: string;
    rating: number;
    year: number;
    language: string;
    country: string;
    img: string;
    age: number;
    genreId: number;
    filmImage: string;
    actors: string;
    information: string;
    someFacts: string;
    userId: number;
    }[]
  ) {
for (const film of films) {
    await prisma.film.create({
    data: film,
    });
    console.log(`Film "${film.name}" added!`);
    }
  }



async function main() {
    const genres = [
        { name: 'Action', description: 'Action-packed movies with exciting scenes.' },
        { name: 'Comedy', description: 'Light-hearted movies meant to entertain.' },
      ];
    
    const films = [
    {
      name: 'Deadpool and Wolverine',
      rating: 7.6,
      year: 2024,
      language: 'English',
      country: 'USA',
      filmImage: "https://m.media-amazon.com/images/M/MV5BZTE0NDhiMTQtODg4NS00NmY0LTljMzYtYjYxMDhmZGNjYjMyXkEyXkFqcGc@._V1_QL75_UX783_.jpg",
      actors: "Раян Рейнольдс",
      information: "Провалив собеседование на вступление в команду Мстителей и расставшись со своей девушкой Ванессой, Уэйд Уилсон ведет спокойную и предсказуемую жизнь, работая продавцом подержанных автомобилей. Поскольку его вселенная оказывается под угрозой из-за смерти «ключевого субъекта» Логана, Уэйд вынужден вновь надеть свой костюм и вернуться к супергеройскому ремеслу. Дэдпул начинает путешествовать по мультивселенной, чтобы разыскать подходящую версию Росомахи и с помощью него спасти родной мир. В ходе своих совместных злоключений двое сталкиваются с могущественным врагом в лице Кассандры Нова — сестры-близнеца Чарльза Ксавьера.",
      someFacts: "Картина собрала в мировом прокате больше 1,33 миллиарда долларов и стала 20-м самым кассовым фильмом всех времён. Композитором фильма стал Роб Симонсен, работавший с Леви над фильмом «Проект „Адам“» (2022) и четвёртым сезоном сериала «Очень странные дела». В ноябре 2024 года на выставке D23 в Бразилии Кевин Файги добавил, что планирует внедрять Дэдпула и Росомаху в будущие проекты КВМ, включая возможный квадриквел, заявив: «Мы всегда думаем, куда их вписать и как можно быстрее».",
      img:'https://musicart.xboxlive.com/7/7e206d00-0000-0000-0000-000000000002/504/image.jpg',
      age: 18,
      genreId: 1,
      userId: 1
    },
    {
      name: 'The Hangover',
      rating: 7.7,
      year: 2009,
      language: 'English',
      country: 'USA',
      filmImage: "https://m.media-amazon.com/images/M/MV5BZTE0NDhiMTQtODg4NS00NmY0LTljMzYtYjYxMDhmZGNjYjMyXkEyXkFqcGc@._V1_QL75_UX783_.jpg",
      actors: "Хью Джекман",
      information: "Провалив собеседование на вступление в команду Мстителей и расставшись со своей девушкой Ванессой, Уэйд Уилсон ведет спокойную и предсказуемую жизнь, работая продавцом подержанных автомобилей. Поскольку его вселенная оказывается под угрозой из-за смерти «ключевого субъекта» Логана, Уэйд вынужден вновь надеть свой костюм и вернуться к супергеройскому ремеслу. Дэдпул начинает путешествовать по мультивселенной, чтобы разыскать подходящую версию Росомахи и с помощью него спасти родной мир. В ходе своих совместных злоключений двое сталкиваются с могущественным врагом в лице Кассандры Нова — сестры-близнеца Чарльза Ксавьера.",
      someFacts: "Картина собрала в мировом прокате больше 1,33 миллиарда долларов и стала 20-м самым кассовым фильмом всех времён. Композитором фильма стал Роб Симонсен, работавший с Леви над фильмом «Проект „Адам“» (2022) и четвёртым сезоном сериала «Очень странные дела». В ноябре 2024 года на выставке D23 в Бразилии Кевин Файги добавил, что планирует внедрять Дэдпула и Росомаху в будущие проекты КВМ, включая возможный квадриквел, заявив: «Мы всегда думаем, куда их вписать и как можно быстрее».",
      img:'https://i.ebayimg.com/images/g/PgEAAMXQ0pNQ9yXn/s-l640.jpg',
      age: 18,
      genreId: 2,
      userId: 1
    },
  ];

  const comments = [
    {
      id: 1,
      text: "I absolutely adore this movie!",
      filmId: 1,
      userId: 1
    },
    {
      id: 3,
      text: "Heheheha",
      filmId: 1,
      userId: 1
    },
    {
      id: 4,
      text: "Uh oh!",
      filmId: 1,
      userId: 1
    },
    {
      id: 5,
      text: "Absolute cinema",
      filmId: 1,
      userId: 1
    },
    {
      id: 2,
      text: "It's a classic!",
      filmId: 2,
      userId: 1
    },
  ]

  const users = [
    {
      username: "Yaroslav VELLIKIY",
      email : "example@gmail.com",
      password : "12345",
      image : "https://m.media-amazon.com/images/I/71cVcFOe7QL._UF1000,1000_QL80_.jpg",
      age : "69"
    },
  ];

    await createUser(users)
    await addGenres(genres)
    await addFilms(films)

    await addComments(comments)

    await getFilm()
    await getFilms()
    await getGenres()
    await getComments()
    await getGenresList()
    await getCommentsList()
    
}

// try - catch
main().then(() => {
    prisma.$disconnect()
}).catch((err) => {
    console.log(err)
    prisma.$disconnect()
})