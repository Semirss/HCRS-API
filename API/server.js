import express from 'express';
import router from './routes/route.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 7000;

const app = express();

app.use(express.json());

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.listen(port, () => {
    console.log(`✅ Server connected to port ${port}`);
});
