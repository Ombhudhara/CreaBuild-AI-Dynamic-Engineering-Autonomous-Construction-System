import express from 'express';
import { predictRisk } from '../controllers/mlController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All ml routes are protected by default (must have valid JWT token)
router.use(protect);

router.route('/predict').post(predictRisk);

export default router;
