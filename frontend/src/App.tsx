import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

import Home from './pages/Home';
import Search from './pages/Search';
import BusDetails from './pages/BusDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import PassengerDetails from './pages/PassengerDetails';
import Payment from './pages/Payment';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/bus/:id" element={<BusDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking/passenger-details" element={<PassengerDetails />} />
            <Route path="/booking/payment" element={<Payment />} />
            <Route path="/booking/confirmation/:id" element={<BookingConfirmation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/bookings" element={<MyBookings />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <AIAssistant />
      <ToastContainer position="bottom-right" />
    </Router>
  );
}

export default App;
