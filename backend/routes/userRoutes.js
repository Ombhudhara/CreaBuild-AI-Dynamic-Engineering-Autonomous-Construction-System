import express from 'express';
import { getUsers, updateUserRole, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply auth middleware and admin role restriction to ALL routes in this file
router.use(protect);
router.use(authorize('Admin'));

// Admin only routes
router.route('/')
    .get(getUsers);

router.route('/:id')
    .put(updateUserRole)
    .delete(deleteUser);

export default router;
