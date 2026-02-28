import express from 'express';
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    assignViewers
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getProjects)
    .post(authorize('Admin', 'Engineer'), createProject);

router
    .route('/:id')
    .put(authorize('Admin', 'Engineer'), updateProject)
    .delete(authorize('Admin', 'Engineer'), deleteProject);

router.route('/:id/assign').put(authorize('Admin', 'Engineer'), assignViewers);

export default router;
