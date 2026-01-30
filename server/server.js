import 'dotenv/config';
import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import { join, dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';

// Import Routers
import userRoutes from './routes/userRoutes.js';
import reportRoutes from './routes/reportRoutes.js'; // <-- Import the new router

const __dirname = dirname(fileURLToPath(import.meta.url));

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

connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected to', MONGO_URI);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));