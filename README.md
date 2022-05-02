[![Tests for sprint 13](https://github.com/MarinaMoskaleva/express-mesto-gha/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/MarinaMoskaleva/express-mesto-gha/actions/workflows/tests-13-sprint.yml)[![Tests for sprint 14](https://github.com/MarinaMoskaleva/express-mesto-gha/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/MarinaMoskaleva/express-mesto-gha/actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд

Проект реализован на платформе Node.jsс использованием фреймворка Express.js. В качестве базы данных используется MongoDB (mongodb://localhost:27017/mestodb).
В проекте выполнена API для работы с карточками (создание, удаление, добавление/удаление лайка). 

### Страница проекта
[Ссылка](https://marinamoskaleva.github.io/express-mesto-gha/)

## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки
`/errors` — папка с файлами классов ошибок
`/models` — папка с файлом для авторизации и централизованная обработка ошибок
  

## Запуск проекта

`npm run start` — запускает сервер
`npm run dev` — запускает сервер с hot-reload
