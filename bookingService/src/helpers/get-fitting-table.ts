import { logger } from "#config/logger"
import { PoolClient } from "pg";


export const getFittingTable = async (restaurant_id:number,booking_time:Date,guests:number,client:PoolClient):Promise<{id:number}|null> => {
    //Сделал так, что столик бронируется на 4 часа, можно это например в табличку ресторанов засунуть если для каждого разные значения
    const query = `
    SELECT t.id
    FROM tables t
    WHERE t.restaurant_id = $1
      AND t.seats >= $2
      AND NOT EXISTS (
        SELECT 1
        FROM bookings b
        WHERE b.restaurant_id = t.restaurant_id
          AND b.table_id = t.id
          AND b.status IN ('CREATED', 'CONFIRMED', 'CHECKING_AVAILABILITY')
          AND ABS(EXTRACT(EPOCH FROM (b.booking_time - $3)) / 3600) < 4
      )
    ORDER BY t.seats ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;
    `
    try {
        const table=await client.query(query,[restaurant_id,guests,booking_time])
        return table.rows[0]
    } catch (e) {
        logger.error(`Error while finding table`, e)
        return null
    }
}