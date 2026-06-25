import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Schedule from '../models/Schedule';

export const createBooking = async (req: any, res: Response) => {
  try {
    const { scheduleId, seatNumbers, passengers, totalFare } = req.body;

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Optional: Check if seats are already booked here...

    const booking = new Booking({
      userId: req.user._id,
      scheduleId,
      seatNumbers,
      passengers,
      totalFare,
      bookingStatus: 'Pending',
      paymentStatus: 'Pending'
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookings = async (req: any, res: Response) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate({
      path: 'scheduleId',
      populate: { path: 'busId routeId' }
    });
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req: any, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    booking.bookingStatus = 'Cancelled';
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    if (req.params.id.startsWith('mock_booking_')) {
      return res.json({
        _id: req.params.id,
        bookingStatus: 'Confirmed',
        paymentStatus: 'Paid',
        totalFare: 500,
        seatNumbers: ['1A', '1B'],
        passengers: [{ name: 'Guest User', age: 25, gender: 'Male' }],
        scheduleId: {
          departureTime: '08:00 AM',
          arrivalTime: '02:00 PM',
          date: new Date(),
          routeId: { source: 'Demo City', destination: 'Destination City' },
          busId: { operator: 'Guest Travels', type: 'AC Sleeper' }
        }
      });
    }

    const booking = await Booking.findById(req.params.id).populate({
      path: 'scheduleId',
      populate: { path: 'busId routeId' }
    });
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
