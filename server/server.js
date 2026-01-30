import dotenv from "dotenv";
import path from "path";

import express from 'express';
import mongoose from "mongoose";

import cors from 'cors';
import { join, dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';

// Import Routers
import userRoutes from './routes/userRoutes.js';
import reportRoutes from './routes/reportRoutes.js'; // <-- Import the new router

// const __dirname = dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const UPLOADS_DIR = join(__dirname, 'uploads');
if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR);

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// === API Routes ===
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes); // <-- Use the new report router

// Connect to MongoDB & start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));
