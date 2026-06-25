import { Request, Response } from 'express';
import Route from '../models/Route';

export const getRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await Route.find({});
    res.json(routes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createRoute = async (req: Request, res: Response) => {
  try {
    const route = new Route(req.body);
    const createdRoute = await route.save();
    res.status(201).json(createdRoute);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
