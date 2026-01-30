import 'dotenv/config';
import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import { join, dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/userRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Uploads
const UPLOADS_DIR = join(__dirname, 'uploads');
if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR);
app.use('/uploads', express.static(UPLOADS_DIR));

// Routes
app.use('/api/auth', authRoutes);   // ✅ FIX
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch(err => console.error('MongoDB connection error:', err));
