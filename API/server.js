import express from 'express';
import router from './routes/route.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 7000;

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Use your routes
app.use('/api', router);

// Listen to the correct port
app.listen(port, () => {
    console.log(`✅ Server connected to port ${port}`);
});
