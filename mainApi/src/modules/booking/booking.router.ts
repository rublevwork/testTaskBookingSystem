import { Router } from "express";
import { bookingController } from "./booking.controller";

const bookingRouter=Router()

bookingRouter.post('/bookings',bookingController.createBooking)
bookingRouter.get('/bookings/:bookingId',bookingController.getBooking)

export default bookingRouter