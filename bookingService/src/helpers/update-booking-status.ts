import { logger } from "#config/logger";
import { PoolClient } from "pg";

export enum BookingStatus {
  CREATED = 'CREATED',
  CHECKING_AVAILABILITY = 'CHECKING_AVAILABILITY',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED'
}

export const updateBookingStatus = async (bookingId: number, status: BookingStatus,client:PoolClient) => {
  try {
    await client.query(
      `UPDATE bookings SET status = $1 WHERE id = $2`,
      [status, bookingId]
    )
  } catch (e) {
    logger.error(`Failed to update status for booking ${bookingId}`, e)
  }
}

export const updateBookingStatusAndTable = async (bookingId: number, status: BookingStatus, table_id: number,client:PoolClient) => {
  try {
    await client.query(
      `UPDATE bookings SET status = $1, table_id = $2 WHERE id = $3`,
      [status, table_id, bookingId]
    )
  } catch (e) {
    logger.error(`Failed to update status and table for booking ${bookingId}`, e)
  }
}