import express from 'express';
import { processPayment, createPaymentIntent } from '../controllers/paymentController';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/process', protect, processPayment);

export default router;
