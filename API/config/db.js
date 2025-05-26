import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const mysqlConnection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}).promise();

mysqlConnection.connect(err => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Database Connected");
});

export default mysqlConnection;