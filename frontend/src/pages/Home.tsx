import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search as SearchIcon } from 'lucide-react';

const Home = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [busType, setBusType] = useState('Any');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (source && destination && date) {
      navigate(`/search?source=${source}&destination=${destination}&date=${date}&type=${busType}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-dark text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Book Your Bus Ticket Now</h1>
          <p className="text-xl mb-10 text-gray-200">Fast, secure, and hassle-free booking experience.</p>

          <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-center gap-4 max-w-5xl mx-auto text-gray-800">
            <div className="flex-1 flex items-center border rounded px-3 py-2">
              <MapPin className="text-gray-400 mr-2" />
              <input type="text" placeholder="From (e.g. New York)" className="w-full outline-none" value={source} onChange={e => setSource(e.target.value)} required />
            </div>
            <div className="flex-1 flex items-center border rounded px-3 py-2">
              <MapPin className="text-gray-400 mr-2" />
              <input type="text" placeholder="To (e.g. Boston)" className="w-full outline-none" value={destination} onChange={e => setDestination(e.target.value)} required />
            </div>
            <div className="flex-1 flex items-center border rounded px-3 py-2">
              <Calendar className="text-gray-400 mr-2" />
              <input type="date" className="w-full outline-none" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="flex-1 flex items-center border rounded px-3 py-2 bg-gray-50">
              <select className="w-full outline-none bg-transparent text-gray-600" value={busType} onChange={e => setBusType(e.target.value)}>
                <option value="Any">Any Bus Type</option>
                <option value="AC Seater">AC Seater</option>
                <option value="AC Sleeper">AC Sleeper</option>
                <option value="Non-AC Seater">Non-AC Seater</option>
                <option value="Non-AC Sleeper">Non-AC Sleeper</option>
              </select>
            </div>
            <button type="submit" className="bg-primary text-white px-8 py-3 rounded font-semibold hover:bg-blue-600 transition flex items-center">
              <SearchIcon className="mr-2" /> Search
            </button>
          </form>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Routes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { src: 'Chennai', dest: 'Hyderabad', label: 'South Express' },
            { src: 'Bangalore', dest: 'Mumbai', label: 'West Coast' },
            { src: 'Delhi', dest: 'Jaipur', label: 'Capital Route' },
            { src: 'Pune', dest: 'Goa', label: 'Holiday Special' }
          ].map((route, idx) => (
            <div 
              key={idx} 
              onClick={() => { setSource(route.src); setDestination(route.dest); }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer hover:border-primary transition-all text-center group"
            >
              <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide bg-blue-50 py-1 rounded">{route.label}</div>
              <div className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">{route.src}</div>
              <div className="text-gray-400 my-1 text-sm">↓ to ↓</div>
              <div className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">{route.dest}</div>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-center mb-12 border-t pt-16">Why Choose BusGo?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
            <p className="text-gray-600">Seamless booking process with instant confirmation.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
            <h3 className="text-xl font-semibold mb-2">Best Offers</h3>
            <p className="text-gray-600">Get the best prices and exclusive discounts.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">Our customer support is here to help you anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
