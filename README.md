Тестовое задание по созданию Системы бронирования столиков

Как запустить:
1. Клонировать репозиторий
2. Зайти в mainApi, настроить .dev.env файл под свою систему
3. Поднять redpanda в докере командой docker compose up -d
4. Выполнить команды npm i, npm run create-tables (для создания таблиц и моковых данных), npm run build, npm run start
5. Зайти в bookingService, настроить .dev.env файл под свою систему
6. Выполнить команды npm i, npm run build, npm run start

Можно отправлять запросы на POST /bookings и GET /bookings/\:bookingId
