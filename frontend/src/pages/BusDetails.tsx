import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useBookingStore } from '../store/useBookingStore';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-toastify';
import { Star, UserCircle2 } from 'lucide-react';

const BusDetails = () => {
  const { selectedSchedule, selectedSeats, addSeat, removeSeat } = useBookingStore();
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  const [bus, setBus] = useState<any>(selectedSchedule?.busId || null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedSchedule) {
      axios.get(`http://localhost:5000/api/buses/${selectedSchedule.busId._id}`)
        .then(res => setBus(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedSchedule]);

  if (!selectedSchedule || !bus) {
    return <div className="text-center py-20">No bus selected. Please search again.</div>;
  }

  const { availableSeats, fare } = selectedSchedule;
  const totalSeats = bus.totalSeats || 40;

  // Mock seat layout: 4 seats per row, divided by aisle
  const seats = Array.from({ length: totalSeats }, (_, i) => `${i + 1}`);

  const handleSeatClick = (seat: string) => {
    if (availableSeats?.includes(seat)) {
      toast.error('Seat already booked');
      return;
    }
    if (selectedSeats.includes(seat)) {
      removeSeat(seat);
    } else {
      if (selectedSeats.length >= 6) {
        toast.warning('You can only book up to 6 seats at once');
        return;
      }
      addSeat(seat);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      toast.warning('Please select at least one seat');
      return;
    }
    if (!user) {
      toast.info('Please login to continue booking');
      navigate('/login?redirect=/booking/passenger-details');
    } else {
      navigate('/booking/passenger-details');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to leave a review'); return; }
    if (!comment.trim()) { toast.error('Comment is required'); return; }
    
    setSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/buses/${bus._id}/reviews`, { rating, comment }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Review submitted successfully');
      const res = await axios.get(`http://localhost:5000/api/buses/${bus._id}`);
      setBus(res.data);
      setComment('');
      setRating(5);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < count ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col md:flex-row gap-8">
      <div className="md:w-2/3">
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Select Seats</h2>
            <div className="flex flex-col items-end">
              <span className="font-bold text-gray-800">{bus.operator}</span>
              <div className="flex items-center text-sm mt-1">
                <span className="mr-2 font-bold">{bus.rating > 0 ? bus.rating.toFixed(1) : 'New'}</span>
                <div className="flex">{renderStars(Math.round(bus.rating || 0))}</div>
                <span className="text-gray-500 ml-2">({bus.numReviews || 0} reviews)</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="bg-white p-8 rounded-2xl border-4 border-gray-200 shadow-inner w-full max-w-md relative">
              {/* Bus Front Styling */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-4 bg-gray-200 px-6 py-2 rounded-full text-xs font-bold text-gray-500 shadow-sm border border-gray-300">
                FRONT
              </div>
              
              <div className="flex justify-between items-center mb-10 border-b-2 border-gray-200 pb-6 pt-4">
                <div className="flex flex-col items-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Driver</span>
                </div>
                <div className="flex flex-col items-center opacity-70">
                  <svg className="w-8 h-10 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Door</span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {seats.map((seat, index) => {
                  const isBooked = availableSeats?.includes(seat);
                  const isSelected = selectedSeats.includes(seat);
                  
                  // create an aisle
                  if (index % 4 === 2) {
                    return (
                      <div key={`aisle-${index}`} className="col-span-1 flex items-center justify-center">
                        <div className="w-full h-full border-r border-dashed border-gray-200 opacity-50"></div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={seat}
                      disabled={isBooked}
                      onClick={() => handleSeatClick(seat)}
                      className={`h-12 rounded-t-xl rounded-b flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-200 transform hover:scale-105 ${
                        isBooked 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                          : isSelected 
                            ? 'bg-primary text-white border-b-4 border-blue-700' 
                            : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center"><div className="w-4 h-4 bg-white border-2 border-gray-300 mr-2 rounded"></div> Available</div>
            <div className="flex items-center"><div className="w-4 h-4 bg-primary mr-2 rounded"></div> Selected</div>
            <div className="flex items-center"><div className="w-4 h-4 bg-gray-300 mr-2 rounded"></div> Booked</div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-6">Passenger Reviews</h3>
          
          {user ? (
            <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="font-semibold mb-3 text-gray-700">Write a Review</h4>
              <div className="mb-3 flex items-center">
                <span className="text-sm font-medium text-gray-600 mr-3">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} transition`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your travel experience..."
                className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary outline-none mb-3 resize-none h-24"
              ></textarea>
              <button type="submit" disabled={submitting} className="bg-primary text-white px-6 py-2 rounded font-bold hover:bg-primary-dark transition disabled:bg-gray-400">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded text-center text-gray-600">
              <a href="/login" className="text-primary font-bold hover:underline">Log in</a> to write a review.
            </div>
          )}

          <div className="space-y-4">
            {bus.reviews && bus.reviews.length > 0 ? (
              bus.reviews.map((rev: any) => (
                <div key={rev._id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <UserCircle2 className="w-8 h-8 text-gray-400 mr-2" />
                      <span className="font-bold text-gray-800">{rev.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex mb-2">{renderStars(rev.rating)}</div>
                  <p className="text-gray-600 text-sm">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="md:w-1/3">
        <div className="bg-white p-6 rounded-lg shadow sticky top-4">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">Booking Summary</h3>
          <div className="space-y-3 mb-6 text-gray-700">
            <p className="flex justify-between"><span>Operator:</span> <span className="font-semibold">{bus.operator}</span></p>
            <p className="flex justify-between"><span>Route:</span> <span className="font-semibold">{selectedSchedule.routeId.source} to {selectedSchedule.routeId.destination}</span></p>
            <p className="flex justify-between"><span>Selected Seats:</span> <span className="font-semibold">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span></p>
          </div>
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Fare:</span>
              <span className="text-primary">₹{selectedSeats.length * fare}</span>
            </div>
          </div>
          <button 
            onClick={handleContinue}
            disabled={selectedSeats.length === 0}
            className={`w-full py-3 rounded font-bold text-white transition ${selectedSeats.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
          >
            Continue to Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusDetails;
