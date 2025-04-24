import express from 'express';

import mongoose from 'mongoose';
import authRoutes from './apis/auth/auth.router.js';
import connectDB from './databases/database.connection.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB(); 

app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
