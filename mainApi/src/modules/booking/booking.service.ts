import { pool } from "#config/db/connection"
import { logger } from "#config/logger"
import { sendBookingEvent } from "#helpers/producer"

export enum BookingStatus {
  CREATED = 'CREATED',
  CHECKING_AVAILABILITY = 'CHECKING_AVAILABILITY',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED'
}

export interface Booking{
    id:number,
    restaurant_id:number,
    table_id:number|null,
    status:BookingStatus,
    booking_time:Date,
    guests:number
}

class BookingService{
    async createBooking(restId:number,time:string,guests:number):Promise<boolean>{
        try {
            const booking=await pool.query(`INSERT INTO bookings (restaurant_id, booking_time, guests)
                VALUES ($1, $2, $3) RETURNING id`,[restId,time,guests])
            const booking_id=booking.rows[0].id
            await sendBookingEvent(booking_id)
            return true
        } catch (e) {
            logger.error("Error in booking.service",e)
            return false
        }
    }
    async getBooking(booking_id:number):Promise<Booking|null>{
        try {
            const booking= await pool.query('SELECT * FROM bookings WHERE id = $1',[booking_id])
            return booking.rows[0]
        } catch (e) {
            logger.error("Error in booking.service",e)
            return null
        }
    }
}

export const bookingService=new BookingService()
