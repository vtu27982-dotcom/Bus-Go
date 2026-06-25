import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import { errorHandler, notFound } from './middlewares/error';
import { seedData } from './seed';

import authRoutes from './routes/auth';
import busRoutes from './routes/buses';
import routeRoutes from './routes/routes';
import scheduleRoutes from './routes/schedules';
import bookingRoutes from './routes/bookings';
import paymentRoutes from './routes/payments';

dotenv.config();

connectDB().then(() => {
  seedData();
});

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.send('BusGo API is running...');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
