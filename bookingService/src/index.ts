import dotenv from "dotenv"
import path from "path"
const envFile=`.${process.env.NODE_ENV}.env`
dotenv.config({path:path.resolve(process.cwd(),envFile)})

import { startBookingConsumer } from "#consumers/booking.consumer"

startBookingConsumer()