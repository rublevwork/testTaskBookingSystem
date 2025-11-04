import { producer } from "#config/kafka/kafka";


export async function sendBookingEvent(booking_id:number) {
  await producer.send({
    topic: "bookings",
    messages: [
      {
        key: String(Date.now()),
        value: JSON.stringify({
          type: "BOOKING_CREATED",
          booking_id,
        }),
      },
    ],
  })
}
