import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-4">&copy; {new Date().getFullYear()} BusGo. All rights reserved.</p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="hover:text-primary">About Us</a>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
          <a href="#" className="hover:text-primary">Terms of Service</a>
          <a href="#" className="hover:text-primary">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
