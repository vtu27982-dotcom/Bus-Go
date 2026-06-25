import express from 'express';
import { searchSchedules, getScheduleById, createSchedule } from '../controllers/scheduleController';
import { protect, admin } from '../middlewares/auth';

const router = express.Router();

router.get('/search', searchSchedules);
router.route('/').post(protect, admin, createSchedule);
router.route('/:id').get(getScheduleById);

export default router;
