import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Setup file paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load environment variables
dotenv.config();

// 2. Initialize Express app
const app = express();

// 3. Middleware to parse incoming JSON data and configure CORS
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-railway-app.railway.app'
  ],
  credentials: true
}));

// 4. Test Route
app.get('/', (req, res) => {
    res.send('Blood bank server is ok');
});

// 5. Connect to MongoDB and start the server
const startServer = async () => {
    try {
         connectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
    }
};

startServer();