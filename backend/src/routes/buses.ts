import express from 'express';
import { getBuses, getBusById, createBus, updateBus, deleteBus, createBusReview } from '../controllers/busController';
import { protect, admin } from '../middlewares/auth';

const router = express.Router();

router.route('/').get(getBuses).post(protect, admin, createBus);
router.route('/:id').get(getBusById).put(protect, admin, updateBus).delete(protect, admin, deleteBus);
router.route('/:id/reviews').post(protect, createBusReview);

export default router;
