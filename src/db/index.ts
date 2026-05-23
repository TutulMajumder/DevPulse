import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.connection_string,
});

export const initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20),
            email VARCHAR(30) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(15) DEFAULT 'contributor',

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);

    await pool.query(`
            CREATE TABLE IF NOT EXISTS issues(
            id SERIAL PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            description VARCHAR(200)  NOT NULL,
            type VARCHAR(20) NOT NULL,
            status VARCHAR(15) DEFAULT 'open',
            reporter_id INT  REFERENCES users ON DELETE CASCADE,

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);

    console.log("Database Connected Successfully!");
  } catch (error) {
    console.log(error);
  }
};
