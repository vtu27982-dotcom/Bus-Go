import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, X } from 'lucide-react';

const AdminDashboard = () => {
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buses');
  const [data, setData] = useState<any[]>([]);
  const [showAddBus, setShowAddBus] = useState(false);
  
  // New bus form state
  const [newBus, setNewBus] = useState({
    busNumber: '',
    operator: '',
    type: 'AC Seater',
    totalSeats: 40,
    amenities: ''
  });

  const [showAddRoute, setShowAddRoute] = useState(false);
  
  // New route form state
  const [newRoute, setNewRoute] = useState({
    source: '',
    destination: '',
    distance: 0
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      const endpoint = activeTab === 'buses' ? '/api/buses' : '/api/routes';
      const res = await axios.get(`http://localhost:5000${endpoint}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddBus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newBus,
        amenities: newBus.amenities.split(',').map(a => a.trim()).filter(a => a)
      };
      await axios.post('http://localhost:5000/api/buses', payload, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      toast.success('Bus added successfully!');
      setShowAddBus(false);
      fetchData(); // Refresh the list
      setNewBus({ busNumber: '', operator: '', type: 'AC Seater', totalSeats: 40, amenities: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add bus');
    }
  };

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/routes', newRoute, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      toast.success('Route added successfully!');
      setShowAddRoute(false);
      fetchData(); // Refresh the list
      setNewRoute({ source: '', destination: '', distance: 0 });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add route');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        {activeTab === 'buses' && (
          <button 
            onClick={() => setShowAddBus(true)}
            className="bg-primary text-white px-4 py-2 rounded flex items-center font-semibold hover:bg-primary-dark transition"
          >
            <Plus className="w-5 h-5 mr-1" /> Add Bus
          </button>
        )}
        {activeTab === 'routes' && (
          <button 
            onClick={() => setShowAddRoute(true)}
            className="bg-primary text-white px-4 py-2 rounded flex items-center font-semibold hover:bg-primary-dark transition"
          >
            <Plus className="w-5 h-5 mr-1" /> Add Route
          </button>
        )}
      </div>
      
      <div className="flex space-x-4 mb-6 border-b">
        <button 
          className={`pb-2 px-4 font-semibold ${activeTab === 'buses' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('buses')}
        >
          Manage Buses
        </button>
        <button 
          className={`pb-2 px-4 font-semibold ${activeTab === 'routes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('routes')}
        >
          Manage Routes
        </button>
      </div>

      {showAddBus && activeTab === 'buses' && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6 relative">
          <button onClick={() => setShowAddBus(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold mb-4">Add New Bus</h3>
          <form onSubmit={handleAddBus} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Bus Number</label>
              <input type="text" required value={newBus.busNumber} onChange={e => setNewBus({...newBus, busNumber: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:border-primary" placeholder="e.g. BUS-123" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Operator Name</label>
              <input type="text" required value={newBus.operator} onChange={e => setNewBus({...newBus, operator: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:border-primary" placeholder="e.g. SRM Travels" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Bus Type</label>
              <select value={newBus.type} onChange={e => setNewBus({...newBus, type: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:border-primary">
                <option value="AC Seater">AC Seater</option>
                <option value="AC Sleeper">AC Sleeper</option>
                <option value="Non-AC Seater">Non-AC Seater</option>
                <option value="Non-AC Sleeper">Non-AC Sleeper</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Total Seats</label>
              <input type="number" required min="10" max="100" value={newBus.totalSeats} onChange={e => setNewBus({...newBus, totalSeats: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded outline-none focus:border-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Amenities (comma separated)</label>
              <input type="text" value={newBus.amenities} onChange={e => setNewBus({...newBus, amenities: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:border-primary" placeholder="WiFi, Blanket, Water Bottle" />
            </div>
            <div className="md:col-span-1 lg:col-span-3 flex justify-end mt-2">
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded font-bold hover:bg-primary-dark transition">Save Bus</button>
            </div>
          </form>
        </div>
      )}

      {showAddRoute && activeTab === 'routes' && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6 relative">
          <button onClick={() => setShowAddRoute(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold mb-4">Add New Route</h3>
          <form onSubmit={handleAddRoute} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Source City</label>
              <input type="text" required value={newRoute.source} onChange={e => setNewRoute({...newRoute, source: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:border-primary" placeholder="e.g. New York" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Destination City</label>
              <input type="text" required value={newRoute.destination} onChange={e => setNewRoute({...newRoute, destination: e.target.value})} className="w-full px-3 py-2 border rounded outline-none focus:border-primary" placeholder="e.g. Boston" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Distance (km)</label>
              <input type="number" required min="10" value={newRoute.distance} onChange={e => setNewRoute({...newRoute, distance: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded outline-none focus:border-primary" />
            </div>
            <div className="md:col-span-1 lg:col-span-3 flex justify-end mt-2">
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded font-bold hover:bg-primary-dark transition">Save Route</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {activeTab === 'buses' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-medium text-gray-600">Bus Number</th>
                <th className="p-4 font-medium text-gray-600">Operator</th>
                <th className="p-4 font-medium text-gray-600">Type</th>
                <th className="p-4 font-medium text-gray-600">Seats</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold">{item.busNumber}</td>
                  <td className="p-4">{item.operator}</td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{item.type}</span>
                  </td>
                  <td className="p-4">{item.totalSeats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-medium text-gray-600">Source</th>
                <th className="p-4 font-medium text-gray-600">Destination</th>
                <th className="p-4 font-medium text-gray-600">Distance (km)</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{item.source}</td>
                  <td className="p-4">{item.destination}</td>
                  <td className="p-4">{item.distance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {data.length === 0 && (
          <div className="p-8 text-center text-gray-500">No records found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
