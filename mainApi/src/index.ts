import dotenv from "dotenv"
import path from "path"
const envFile=`.${process.env.NODE_ENV}.env`
dotenv.config({path:path.resolve(process.cwd(),envFile)})

import app from "./app"
import { logger } from "./config/logger"
import { initKafkaProducer } from "#config/kafka/kafka"


const PORT=process.env.PORT

const start=async () => {
    await initKafkaProducer()
    app.listen(PORT,()=>{
        logger.info(`Сервер запущен на порту ${PORT}`)
    })
}
start()