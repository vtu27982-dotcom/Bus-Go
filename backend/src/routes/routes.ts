import express from 'express';
import { getRoutes, createRoute } from '../controllers/routeController';
import { protect, admin } from '../middlewares/auth';

const router = express.Router();

router.route('/').get(getRoutes).post(protect, admin, createRoute);

export default router;
