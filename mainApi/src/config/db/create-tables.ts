// Создание таблиц и наполнение моковыми данными

import dotenv from "dotenv";
import path from "path";
const envFile = `.${process.env.NODE_ENV}.env`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) })

import { pool } from "./connection";


const createTables = async () => {
    const client = await pool.connect()

    try {
        // Создание таблиц
        await client.query(`
            CREATE TABLE IF NOT EXISTS restaurants (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS tables (
                id SERIAL PRIMARY KEY,
                restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
                seats INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
                table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,
                status TEXT DEFAULT 'CREATED',
                booking_time TIMESTAMPTZ NOT NULL,
                guests INTEGER NOT NULL
            );
        `)


        const checkRes = await client.query(`SELECT COUNT(*) FROM restaurants;`)
        const restaurantCount = parseInt(checkRes.rows[0].count)

        if (restaurantCount === 0) {

            const restaurantNames = Array.from({ length: 10 }, (_, i) => `Restaurant ${i + 1}`)
            for (const name of restaurantNames) {
                await client.query(`INSERT INTO restaurants (name) VALUES ($1);`, [name])
            }

            const resRestaurants = await client.query(`SELECT id FROM restaurants;`)
            const restaurants = resRestaurants.rows

            for (const restaurant of restaurants) {
                for (let i = 0; i < 15; i++) {
                    const seats = Math.floor(Math.random() * 9) + 2
                    await client.query(
                        `INSERT INTO tables (restaurant_id, seats) VALUES ($1, $2);`,
                        [restaurant.id, seats]
                    )
                }
                console.log("Моковые рестораны и столики успешно добавлены.")
            }

        } else {
            console.log("Моковые данные уже существуют, пропускаем вставку.")
        }
    } catch (e) {
        console.error(e)
    } finally {
        client.release()
        await pool.end()
    }
};

createTables()
