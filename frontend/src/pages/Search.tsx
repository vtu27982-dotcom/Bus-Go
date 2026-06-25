import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, IndianRupee, Filter } from 'lucide-react';
import { useBookingStore } from '../store/useBookingStore';

const Search = () => {
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');
  const defaultType = searchParams.get('type');

  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    defaultType && defaultType !== 'Any' ? [defaultType] : []
  );
  
  const navigate = useNavigate();
  const setSchedule = useBookingStore(state => state.setSchedule);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/schedules/search?source=${source}&destination=${destination}&date=${date}`);
        setSchedules(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (source && destination && date) {
      fetchSchedules();
    } else {
      setLoading(false);
    }
  }, [source, destination, date]);

  const handleSelectBus = (schedule: any) => {
    setSchedule(schedule);
    navigate(`/bus/${schedule._id}`);
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Static list of standard bus types so filters always appear
  const busTypes = [
    'AC Seater',
    'AC Sleeper',
    'Non-AC Seater',
    'Non-AC Sleeper'
  ];

  const filteredSchedules = useMemo(() => {
    if (selectedTypes.length === 0) return schedules;
    return schedules.filter(s => selectedTypes.includes(s.busId.type));
  }, [schedules, selectedTypes]);

  if (loading) return <div className="text-center py-20 text-2xl">Loading buses...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col md:flex-row gap-8">
      
      <div className="md:w-1/4">
        <div className="bg-white p-6 rounded-lg shadow sticky top-4">
          <h3 className="text-lg font-bold mb-4 flex items-center border-b pb-2"><Filter className="w-5 h-5 mr-2"/> Filters</h3>
          
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Bus Type</h4>
            {busTypes.length === 0 && <p className="text-sm text-gray-500">No types available</p>}
            <div className="space-y-2">
              {busTypes.map(type => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-primary focus:ring-primary"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeToggle(type)}
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="md:w-3/4">
        <h2 className="text-2xl font-bold mb-6">
          Buses from {source} to {destination} on {date}
        </h2>
        
        {filteredSchedules.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-600">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {schedules.length === 0 
                ? "No buses found for this route on the selected date."
                : "No buses match the selected filters."}
            </h3>
            {schedules.length === 0 && (
              <div className="mt-6 text-left">
                <p className="text-gray-500 mb-4 font-semibold text-center">Try searching for one of our popular routes:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { s: 'Delhi', d: 'Mumbai' },
                    { s: 'Bangalore', d: 'Chennai' },
                    { s: 'Hyderabad', d: 'Pune' },
                    { s: 'Kolkata', d: 'Siliguri' },
                    { s: 'Jaipur', d: 'Delhi' },
                    { s: 'Goa', d: 'Mumbai' },
                    { s: 'Ahmedabad', d: 'Surat' },
                    { s: 'Lucknow', d: 'Kanpur' },
                    { s: 'Chandigarh', d: 'Shimla' },
                    { s: 'Kochi', d: 'Trivandrum' },
                    { s: 'Chennai', d: 'Madurai' },
                    { s: 'Indore', d: 'Bhopal' }
                  ].map((r, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        // Quick search for today
                        const today = new Date().toISOString().split('T')[0];
                        navigate(`/search?source=${r.s}&destination=${r.d}&date=${today}`);
                      }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition text-center shadow-sm"
                    >
                      <span className="block font-bold text-gray-800">{r.s}</span>
                      <span className="block text-gray-400 text-sm my-1">to</span>
                      <span className="block font-bold text-gray-800">{r.d}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSchedules.map(schedule => (
              <div key={schedule._id} className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row justify-between items-center border border-gray-100 hover:shadow-md transition">
                <div className="flex-1 mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-gray-800">{schedule.busId.operator}</h3>
                  <span className="inline-block bg-blue-100 text-primary text-xs px-2 py-1 rounded font-semibold mb-4">{schedule.busId.type}</span>
                  <div className="flex items-center space-x-8 text-gray-700">
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg flex items-center"><Clock className="w-4 h-4 mr-1"/> {schedule.departureTime}</span>
                      <span className="text-sm text-gray-500">{schedule.routeId.source}</span>
                    </div>
                    <div className="text-gray-400">---&gt;</div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg flex items-center"><Clock className="w-4 h-4 mr-1"/> {schedule.arrivalTime}</span>
                      <span className="text-sm text-gray-500">{schedule.routeId.destination}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-gray-200">
                  <div className="text-2xl font-bold text-primary mb-1 flex items-center">
                    <IndianRupee className="w-5 h-5"/> {schedule.fare}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{schedule.busId.totalSeats - schedule.availableSeats.length} Seats Available</p>
                  <button 
                    onClick={() => handleSelectBus(schedule)}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded font-semibold transition"
                  >
                    View Seats
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
