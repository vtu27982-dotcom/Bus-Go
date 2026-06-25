import { Request, Response } from 'express';
import Bus from '../models/Bus';

export const getBuses = async (req: Request, res: Response) => {
  try {
    const buses = await Bus.find({});
    res.json(buses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBusById = async (req: Request, res: Response) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (bus) {
      res.json(bus);
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBus = async (req: Request, res: Response) => {
  try {
    const bus = new Bus(req.body);
    const createdBus = await bus.save();
    res.status(201).json(createdBus);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBus = async (req: Request, res: Response) => {
  try {
    const { busNumber, operator, type, totalSeats, amenities } = req.body;
    const bus = await Bus.findById(req.params.id);

    if (bus) {
      bus.busNumber = busNumber || bus.busNumber;
      bus.operator = operator || bus.operator;
      bus.type = type || bus.type;
      bus.totalSeats = totalSeats || bus.totalSeats;
      bus.amenities = amenities || bus.amenities;

      const updatedBus = await bus.save();
      res.json(updatedBus);
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBus = async (req: Request, res: Response) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (bus) {
      await bus.deleteOne();
      res.json({ message: 'Bus removed' });
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBusReview = async (req: any, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const bus = await Bus.findById(req.params.id);

    if (bus) {
      const alreadyReviewed = bus.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Bus already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      bus.reviews.push(review as any);
      bus.numReviews = bus.reviews.length;
      bus.rating =
        bus.reviews.reduce((acc, item) => item.rating + acc, 0) /
        bus.reviews.length;

      await bus.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
