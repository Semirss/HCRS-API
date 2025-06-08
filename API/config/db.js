import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
        });

        console.log("✅ MySQL Database connected successfully.");
        return connection;
    } catch (err) {
        console.error("❌ Failed to connect to the database:", err.message);
        process.exit(1); 
    }
}

const mysqlConnection = await connectToDatabase();
export default mysqlConnection;
