import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection setup
mongoose.connect(`${process.env.MONGO_URI}`)
.then(() => console.log("Connected to DB"))
.catch(console.error);

// Start Server
const PORT = process.env.PORT || 5000; // Use the PORT environment variable if it's defined, otherwise default to port 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });