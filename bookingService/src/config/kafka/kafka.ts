import { Kafka } from "kafkajs"
import { logger } from "#config/logger"

const broker = process.env.KAFKA_BROKER || "localhost:9092"

const kafka = new Kafka({
  clientId: "booking-service",
  brokers: [broker],
});

export const consumer = kafka.consumer({ groupId: "booking-consumers" })

export const initBookingConsumer = async () => {
  await consumer.connect()
  process.on("SIGINT",async()=>{
    await consumer.disconnect()
  })
  logger.info('Booking consumer inited')
}