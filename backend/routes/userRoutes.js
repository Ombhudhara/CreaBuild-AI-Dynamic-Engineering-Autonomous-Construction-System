import express from 'express';
import { getUsers, updateUserRole, deleteUser, getViewers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply auth middleware
router.use(protect);

// Allow any authenticated user (or at least Engineer/Admin) to fetch list of Viewers
router.route('/viewers').get(getViewers);

// Require Admin role for everything else below
router.use(authorize('Admin'));

// Admin only routes
router.route('/')
    .get(getUsers);

router.route('/:id')
    .put(updateUserRole)
    .delete(deleteUser);

export default router;
