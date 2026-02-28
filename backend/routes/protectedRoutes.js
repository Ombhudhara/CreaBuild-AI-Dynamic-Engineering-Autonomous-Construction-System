import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

// @desc    Dashboard Access
// @route   GET /api/dashboard
// @access  Private (Admin, Engineer, Viewer)
router.get('/dashboard', authorize('Admin', 'Engineer', 'Viewer'), (req, res) => {
    res.status(200).json({
        success: true,
        data: 'Welcome to the Live Digital Twin Dashboard.'
    });
});

// @desc    Configuration Access
// @route   GET /api/config
// @access  Private (Admin, Engineer)
router.get('/config', authorize('Admin', 'Engineer'), (req, res) => {
    res.status(200).json({
        success: true,
        data: 'Welcome to the A.I. Project Configuration Matrix.'
    });
});

// @desc    Analysis Matrix Access
// @route   GET /api/analysis
// @access  Private (Admin, Engineer)
router.get('/analysis', authorize('Admin', 'Engineer'), (req, res) => {
    res.status(200).json({
        success: true,
        data: 'Welcome to Structural Design Analysis.'
    });
});

export default router;
