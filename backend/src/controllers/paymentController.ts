import { Request, Response } from 'express';
import Payment from '../models/Payment';
import Booking from '../models/Booking';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-01-27.acacia' as any,
});

export const createPaymentIntent = async (req: any, res: Response) => {
  try {
    const { amount } = req.body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(200).json({ clientSecret: 'mock_secret_no_key_provided' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in smallest currency unit (paise/cents)
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const processPayment = async (req: any, res: Response) => {
  try {
    const { bookingId, amount, paymentMethod, paymentIntentId } = req.body;

    // Support for Guest Mode / Mock Bookings
    if (bookingId && bookingId.startsWith('mock_booking_')) {
      return res.status(201).json({
        bookingId,
        amount,
        paymentMethod: paymentMethod || 'Mock',
        transactionId: paymentIntentId || `txn_${Math.random().toString(36).substr(2, 9)}`,
        status: 'Success'
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const payment = new Payment({
      bookingId,
      userId: req.user._id,
      amount,
      paymentMethod: paymentMethod || 'Stripe',
      transactionId: paymentIntentId || `txn_${Math.random().toString(36).substr(2, 9)}`,
      status: 'Success'
    });

    await payment.save();

    booking.paymentStatus = 'Paid';
    booking.bookingStatus = 'Confirmed';
    await booking.save();

    // Simulating sending an email
    console.log(`\n========================================`);
    console.log(`📧 MOCK EMAIL NOTIFICATION SENT!`);
    console.log(`To: User ID ${req.user._id}`);
    console.log(`Subject: Your BusGo Ticket is Confirmed! (Booking ID: ${booking._id})`);
    console.log(`Amount Paid: ₹${amount}`);
    console.log(`========================================\n`);

    res.status(201).json(payment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
