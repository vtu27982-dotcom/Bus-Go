import mongoose from 'mongoose';
import Bus from './models/Bus';
import Route from './models/Route';
import Schedule from './models/Schedule';
import User from './models/User';

export const seedData = async () => {
  try {
    // Only seed if empty
    const count = await Bus.countDocuments();
    if (count > 0) return;

    await Bus.deleteMany();
    await Route.deleteMany();
    await Schedule.deleteMany();
    await User.deleteMany();

    console.log('Database Cleared for Seeding');

    const createdRoutes = await Route.insertMany([
      { source: 'New York', destination: 'Boston', distance: 215 },
      { source: 'Los Angeles', destination: 'San Francisco', distance: 380 },
      { source: 'Chicago', destination: 'Detroit', distance: 280 },
      { source: 'Chennai', destination: 'Hyderabad', distance: 630 },
      { source: 'Bangalore', destination: 'Mumbai', distance: 980 },
      { source: 'Delhi', destination: 'Jaipur', distance: 280 },
      { source: 'Pune', destination: 'Goa', distance: 450 }
    ]);

    const createdBuses = await Bus.insertMany([
      { busNumber: 'BUS-101', operator: 'Express Travels', type: 'AC Seater', totalSeats: 40, amenities: ['WiFi', 'Charging Point'] },
      { busNumber: 'BUS-102', operator: 'Night Rider', type: 'AC Sleeper', totalSeats: 30, amenities: ['Blanket', 'Water Bottle', 'WiFi'] },
      { busNumber: 'BUS-103', operator: 'City Transit', type: 'Non-AC Seater', totalSeats: 50, amenities: [] },
      { busNumber: 'BUS-IND-1', operator: 'Orange Tours', type: 'AC Sleeper', totalSeats: 36, amenities: ['WiFi', 'Blanket', 'Water Bottle'] },
      { busNumber: 'BUS-IND-2', operator: 'SRM Travels', type: 'AC Seater', totalSeats: 45, amenities: ['Charging Point', 'Movies'] },
      { busNumber: 'BUS-IND-3', operator: 'VRL Travels', type: 'AC Sleeper', totalSeats: 40, amenities: ['WiFi', 'Blanket', 'Charging Point'] },
      { busNumber: 'BUS-IND-4', operator: 'Zingbus', type: 'AC Seater', totalSeats: 45, amenities: ['Water Bottle', 'Snacks'] },
      { busNumber: 'BUS-IND-5', operator: 'Konduskar', type: 'AC Sleeper', totalSeats: 30, amenities: ['WiFi', 'Blanket', 'Charging Point'] }
    ]);

    const dateStr = new Date().toISOString().split('T')[0]; // Today's date

    await Schedule.insertMany([
      // US Routes
      { busId: createdBuses[0]._id, routeId: createdRoutes[0]._id, date: new Date(dateStr), departureTime: '08:00 AM', arrivalTime: '12:30 PM', fare: 45, availableSeats: [] },
      { busId: createdBuses[1]._id, routeId: createdRoutes[0]._id, date: new Date(dateStr), departureTime: '10:00 PM', arrivalTime: '03:00 AM', fare: 65, availableSeats: [] },
      { busId: createdBuses[2]._id, routeId: createdRoutes[0]._id, date: new Date(dateStr), departureTime: '09:00 AM', arrivalTime: '02:00 PM', fare: 25, availableSeats: [] },
      
      // Chennai -> Hyderabad
      { busId: createdBuses[3]._id, routeId: createdRoutes[3]._id, date: new Date(dateStr), departureTime: '07:30 PM', arrivalTime: '06:00 AM', fare: 1200, availableSeats: [] },
      { busId: createdBuses[4]._id, routeId: createdRoutes[3]._id, date: new Date(dateStr), departureTime: '10:00 PM', arrivalTime: '09:30 AM', fare: 850, availableSeats: [] },
      
      // Bangalore -> Mumbai
      { busId: createdBuses[5]._id, routeId: createdRoutes[4]._id, date: new Date(dateStr), departureTime: '06:00 PM', arrivalTime: '08:00 AM', fare: 1800, availableSeats: [] },
      { busId: createdBuses[3]._id, routeId: createdRoutes[4]._id, date: new Date(dateStr), departureTime: '08:30 PM', arrivalTime: '11:00 AM', fare: 2000, availableSeats: [] },

      // Delhi -> Jaipur
      { busId: createdBuses[6]._id, routeId: createdRoutes[5]._id, date: new Date(dateStr), departureTime: '06:00 AM', arrivalTime: '11:30 AM', fare: 500, availableSeats: [] },
      { busId: createdBuses[4]._id, routeId: createdRoutes[5]._id, date: new Date(dateStr), departureTime: '02:00 PM', arrivalTime: '07:30 PM', fare: 450, availableSeats: [] },

      // Pune -> Goa
      { busId: createdBuses[7]._id, routeId: createdRoutes[6]._id, date: new Date(dateStr), departureTime: '09:00 PM', arrivalTime: '07:00 AM', fare: 1500, availableSeats: [] }
    ]);

    console.log('Mock Data Imported Successfully!');
  } catch (error) {
    console.error(`Error in seeding: ${error}`);
  }
};
