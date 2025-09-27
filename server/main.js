/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';

import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import authRoutes from './src/routes/authRoutes.js';
import orgRoutes from './src/routes/orgRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import Organization from './src/models/Organization.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
dotenv.config();
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: 'true' }));
app.use(helmet());
app.use(morgan('common'));
app.use(cors());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

try {
  await mongoose.connect(process.env.MONGO_URL);
  const port = process.env.PORT || 8080;
  const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on 0.0.0.0:${port}`);
});
  server.on('error', console.error);
} catch (error) {
  console.error(' MongoDB connection error:', error.message);
  process.exit(1);
}

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to server!' });
});

app.use('/auth', authRoutes);

app.use('/organizations', orgRoutes);

app.use('/tasks', taskRoutes);
