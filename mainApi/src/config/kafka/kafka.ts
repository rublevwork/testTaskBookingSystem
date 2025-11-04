import { logger } from "#config/logger"
import { Kafka } from "kafkajs"

const broker = process.env.KAFKA_BROKER || "localhost:9092"

export const kafka = new Kafka({
  clientId: "booking-service",
  brokers: [broker],
})

export const producer = kafka.producer()

export const initKafkaProducer = async () => {
  await producer.connect()
  process.on("SIGINT",async()=>{
    await producer.disconnect()
  })
  logger.info('Kafka producer inited')
}