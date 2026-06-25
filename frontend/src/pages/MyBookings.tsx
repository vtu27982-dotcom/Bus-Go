import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const user = useAuthStore(state => state.user);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const cancelBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) return <div className="text-center py-20">Loading your bookings...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-600">
          You have no bookings yet.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row justify-between items-center border border-gray-100">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="text-lg font-bold">{booking.scheduleId?.busId?.operator || 'Unknown Operator'}</h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${booking.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-700' : booking.bookingStatus === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {booking.bookingStatus}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-1">Route: {booking.scheduleId?.routeId?.source} to {booking.scheduleId?.routeId?.destination}</p>
                <p className="text-gray-600 text-sm mb-1">Date: {booking.scheduleId ? new Date(booking.scheduleId.date).toLocaleDateString() : 'N/A'}</p>
                <p className="text-gray-600 text-sm">Seats: {booking.seatNumbers.join(', ')}</p>
              </div>
              <div className="text-right mt-4 md:mt-0 flex flex-col justify-end items-end">
                <p className="text-xl font-bold text-primary mb-2">₹{booking.totalFare}</p>
                {booking.bookingStatus !== 'Cancelled' && (
                  <button 
                    onClick={() => cancelBooking(booking._id)}
                    className="text-red-500 text-sm font-semibold hover:underline"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
