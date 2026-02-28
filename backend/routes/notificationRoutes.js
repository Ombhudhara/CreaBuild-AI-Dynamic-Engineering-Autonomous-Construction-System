import express from 'express';
import {
    getNotifications,
    markNotificationRead,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getNotifications);
router.route('/:id/read').put(markNotificationRead);

export default router;
