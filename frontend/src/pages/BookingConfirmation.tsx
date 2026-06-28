import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { CheckCircle, Download } from 'lucide-react';

const BookingConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  const stateData = location.state as any || {};
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (id?.startsWith('mock_booking_')) {
        const mockBooking = {
          _id: id,
          bookingStatus: 'Confirmed',
          paymentStatus: 'Paid',
          totalFare: stateData.finalFare || 500,
          seatNumbers: stateData.selectedSeats?.length > 0 ? stateData.selectedSeats : ['1A', '1B'],
          passengers: [{ name: user?.name || 'Guest User', age: 25, gender: 'Male' }],
          scheduleId: stateData.selectedSchedule || {
            departureTime: '08:00 AM',
            arrivalTime: '02:00 PM',
            date: new Date(),
            routeId: { source: 'Demo City', destination: 'Destination City' },
            busId: { operator: 'Guest Travels', type: 'AC Sleeper' }
          }
        };
        setBooking(mockBooking);
        
        // Save mock booking to localStorage so it appears in history
        const storedMocks = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
        if (!storedMocks.find((b: any) => b._id === id)) {
          localStorage.setItem('mock_bookings', JSON.stringify([mockBooking, ...storedMocks]));
        }
        
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setBooking(data);
      } catch (error) {
        console.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    if (user && id) fetchBooking();
  }, [id, user]);

  if (loading) return <div className="text-center py-20">Loading confirmation...</div>;
  if (!booking) return <div className="text-center py-20">Booking not found.</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
      <p className="text-gray-600 mb-8">Thank you for choosing BusGo. Have a safe journey.</p>
      
      <div className="bg-white p-6 rounded-lg shadow-lg text-left border border-gray-100 mb-8">
        <div className="flex justify-between border-b pb-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Booking ID</p>
            <p className="font-bold">{booking._id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-bold text-green-600 uppercase">{booking.bookingStatus}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Operator</p>
            <p className="font-semibold">{booking.scheduleId.busId.operator}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Route</p>
            <p className="font-semibold">{booking.scheduleId.routeId.source} - {booking.scheduleId.routeId.destination}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-semibold">{new Date(booking.scheduleId.date).toLocaleDateString()} at {booking.scheduleId.departureTime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Seats</p>
            <p className="font-semibold">{booking.seatNumbers.join(', ')}</p>
          </div>
        </div>
        
        <div className="border-t pt-4 flex justify-between items-center">
          <p className="text-lg font-bold">Total Paid</p>
          <p className="text-2xl font-bold text-primary">₹{booking.totalFare}</p>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button className="bg-gray-100 text-gray-800 px-6 py-2 rounded font-semibold hover:bg-gray-200 transition flex items-center">
          <Download className="w-5 h-5 mr-2" /> Download E-Ticket
        </button>
        <Link to="/" className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primary-dark transition">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
