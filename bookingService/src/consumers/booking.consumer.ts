import { consumer } from "#config/kafka/kafka";
import { logger } from "#config/logger";
import { pool } from "#config/db/connection";
import { updateBookingStatus,BookingStatus, updateBookingStatusAndTable } from "#helpers/update-booking-status";
import { getFittingTable } from "#helpers/get-fitting-table";

export const startBookingConsumer=async()=>{
    await consumer.subscribe({ topic: "bookings"})
    
    await consumer.run({
        eachMessage:async({ topic, partition, message })=>{
            let client
            try {
                client=await pool.connect()
                await client.query('BEGIN')
                const payload=JSON.parse(message.value!.toString())

                const booking_id=payload.booking_id


                await updateBookingStatus(booking_id,BookingStatus.CHECKING_AVAILABILITY,client)

                const booking=await client.query('SELECT * FROM bookings WHERE id=$1',[booking_id])
                if(booking.rows.length===0){
                    throw new Error(`No booking with id = ${booking_id} was found`)
                }
                const {restaurant_id,booking_time,guests}=booking.rows[0]

                const table=await getFittingTable(restaurant_id,new Date(booking_time),guests,client)
                
                if(!table){
                    await updateBookingStatus(booking_id,BookingStatus.REJECTED,client)
                    await client.query('COMMIT')
                    return
                }
                const table_id=table.id
                await updateBookingStatusAndTable(booking_id,BookingStatus.CONFIRMED,table_id,client)

                await client.query('COMMIT')
                logger.info(`Booking ${booking_id} confirmed for table ${table_id}`)
            } catch (e) {
                if(client){
                    await client.query('ROLLBACK')
                }else{
                    logger.error('Rollback failed')
                }
                logger.error('Error in booking.consumer',e)
                // Можно было бы добавить обработку ошибок и смену статуса на ERROR
            }finally{
                if(client){
                    client.release()
                }
            }
        }
    })
}