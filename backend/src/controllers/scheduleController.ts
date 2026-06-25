import { Request, Response } from 'express';
import Schedule from '../models/Schedule';

export const searchSchedules = async (req: Request, res: Response) => {
  try {
    const { source, destination, date } = req.query;

    const schedules = await Schedule.find().populate({
      path: 'routeId',
      match: { 
        source: { $regex: new RegExp(`^${source}$`, 'i') }, 
        destination: { $regex: new RegExp(`^${destination}$`, 'i') } 
      }
    }).populate('busId');

    // Filter out schedules where route didn't match
    let filteredSchedules = schedules.filter(s => s.routeId !== null);

    // If no schedules found, check if the route exists at all
    if (filteredSchedules.length === 0) {
      const mongoose = require('mongoose');
      const Route = mongoose.model('Route');
      const Bus = mongoose.model('Bus');
      
      let route = await Route.findOne({
        source: { $regex: new RegExp(`^${source}$`, 'i') }, 
        destination: { $regex: new RegExp(`^${destination}$`, 'i') } 
      });

      // If route doesn't exist, create a mock one for the demo
      if (!route && source && destination) {
        route = new Route({
          source: String(source),
          destination: String(destination),
          distance: Math.floor(Math.random() * 500) + 100
        });
        await route.save();
      }

      if (route) {
        // Find some buses, or create a mock bus if none exist
        let buses = await Bus.find().limit(2);
        
        if (buses.length === 0) {
          const mockBus = new Bus({
            busNumber: `BUS-${Math.floor(Math.random() * 9000) + 1000}`,
            operator: 'Demo Travels',
            type: 'AC Sleeper',
            totalSeats: 40,
            amenities: ['WiFi', 'Blanket', 'Water Bottle']
          });
          await mockBus.save();
          buses = [mockBus];
        }

        if (buses.length > 0) {
          const newSchedules = [];
          for (const bus of buses) {
            const schedule = new Schedule({
              busId: bus._id,
              routeId: route._id,
              date: new Date(String(date) || new Date()), // Use searched date or today
              departureTime: '08:00 AM',
              arrivalTime: '02:00 PM',
              fare: Math.floor(Math.random() * 1000) + 500,
              availableSeats: []
            });
            await schedule.save();
            // populate it manually to match return format
            newSchedules.push({
              ...schedule.toObject(),
              busId: bus,
              routeId: route
            });
          }
          filteredSchedules = newSchedules;
        }
      }
    }

    res.json(filteredSchedules);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getScheduleById = async (req: Request, res: Response) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate('busId').populate('routeId');
    if (schedule) {
      res.json(schedule);
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const schedule = new Schedule(req.body);
    const createdSchedule = await schedule.save();
    res.status(201).json(createdSchedule);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
