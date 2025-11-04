import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import z from 'zod'
import { logger } from "#config/logger";

const createBookingSchema=z.object({
    restaurant_id:z.number(),
    booking_time:z.string().refine((val)=>!isNaN(Date.parse(val))),
    guests:z.number().min(1)
})

const getBookingSchema=z.object({
    bookingId:z.string().regex(/^\d+$/)
})

class BookingController{
    async createBooking(req:Request,res:Response){
        try {
            const {restaurant_id,booking_time,guests}=createBookingSchema.parse(req.body)

            const service_res=await bookingService.createBooking(restaurant_id,booking_time,guests)
            if(!service_res){
                throw new Error('Error while creating booking')
            }
            return res.status(200).json({message:'ok'})
        } catch (e) {
            logger.error("Error in booking.controller",e)
            if(e instanceof z.ZodError){
                return res.status(400).json({
                    error:'Validation error',
                    details:e
                })
            }else{
                return res.status(500).json({
                    error:'Internal server error',
                    details:e
                })
            }
        }
    }
    async getBooking(req:Request,res:Response){
        try {
            const {bookingId}=getBookingSchema.parse(req.params)

            const booking=await bookingService.getBooking(+bookingId)
            if(!booking){
                return res.status(404).json({
                    error:'Not found',
                    details:`Booking with id = ${bookingId} was not found`
                })
            }
            return res.status(200).json({booking})
        } catch (e) {
            logger.error("Error in booking.controller",e)
            if(e instanceof z.ZodError){
                return res.status(400).json({
                    error:'Validation error',
                    details:e
                })
            }else{
                return res.status(500).json({
                    error:'Internal server error',
                    details:e
                })
            }
        }
    }
}

export const bookingController=new BookingController()