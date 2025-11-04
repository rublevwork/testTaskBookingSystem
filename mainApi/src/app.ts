import express,{json} from 'express'
import bookingRouter from '#modules/booking/booking.router'

const app = express()

app.use(json())
app.use(bookingRouter)
export default app