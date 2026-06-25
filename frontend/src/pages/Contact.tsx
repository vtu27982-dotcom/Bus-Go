import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-xl font-bold mb-6 text-gray-800">Get in Touch</h3>
          <p className="text-gray-600 mb-8">We are here to help and answer any question you might have. We look forward to hearing from you.</p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className="w-6 h-6 text-primary mt-1 mr-4" />
              <div>
                <h4 className="font-semibold text-gray-800">Office Address</h4>
                <p className="text-gray-600">123 BusGo Tower, Tech Park<br />Silicon Valley, CA 94043</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="w-6 h-6 text-primary mt-1 mr-4" />
              <div>
                <h4 className="font-semibold text-gray-800">Phone Number</h4>
                <p className="text-gray-600">+1 (800) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="w-6 h-6 text-primary mt-1 mr-4" />
              <div>
                <h4 className="font-semibold text-gray-800">Email Address</h4>
                <p className="text-gray-600">support@busgo.com</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Send us a Message</h3>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Message sent!'); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input type="text" required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea required rows={4} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary outline-none"></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-primary-dark transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
