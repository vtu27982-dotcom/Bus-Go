import express from 'express';
import { createBooking, getMyBookings, cancelBooking, getBookingById } from '../controllers/bookingController';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.route('/').post(protect, createBooking);
router.route('/my-bookings').get(protect, getMyBookings);
router.route('/:id').get(protect, getBookingById);
router.route('/:id/cancel').put(protect, cancelBooking);

export default router;
