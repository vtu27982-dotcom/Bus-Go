import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/useBookingStore';

const PassengerDetails = () => {
  const { selectedSchedule, selectedSeats, setPassengers } = useBookingStore();
  const navigate = useNavigate();

  // Initialize passenger state based on selected seats
  const [passengerData, setPassengerData] = useState(
    selectedSeats.map(seat => ({
      seatNumber: seat,
      name: '',
      age: '',
      gender: 'Male'
    }))
  );

  if (!selectedSchedule || selectedSeats.length === 0) {
    return <div className="text-center py-20">No seats selected. Please go back and select seats.</div>;
  }

  const handleInputChange = (index: number, field: string, value: string) => {
    const updated = [...passengerData];
    updated[index] = { ...updated[index], [field]: value };
    setPassengerData(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassengers(passengerData);
    navigate('/booking/payment');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Passenger Details</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          {passengerData.map((passenger, index) => (
            <div key={passenger.seatNumber} className="border-b pb-6 last:border-b-0 last:pb-0">
              <h3 className="font-semibold text-lg mb-4 text-primary">Passenger {index + 1} (Seat {passenger.seatNumber})</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={passenger.name}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    className="w-full border rounded px-3 py-2 outline-none focus:border-primary"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={passenger.age}
                    onChange={(e) => handleInputChange(index, 'age', e.target.value)}
                    className="w-full border rounded px-3 py-2 outline-none focus:border-primary"
                    placeholder="Age"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Gender</label>
                  <select
                    value={passenger.gender}
                    onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                    className="w-full border rounded px-3 py-2 outline-none focus:border-primary"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900 font-semibold"
            >
              Back
            </button>
            <button 
              type="submit"
              className="bg-primary text-white px-8 py-3 rounded font-bold hover:bg-primary-dark transition"
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PassengerDetails;
