import Project from '../models/Project.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// @desc    Get all projects according to role
// @route   GET /api/projects
// @access  Private
export const getProjects = asyncHandler(async (req, res) => {
    let projects;

    if (req.user.role === 'Admin') {
        projects = await Project.find()
            .populate('createdBy', 'name email')
            .populate('assignedViewers', 'name email')
            .populate('pendingViewers', 'name email');
    } else if (req.user.role === 'Engineer') {
        projects = await Project.find({ createdBy: req.user._id })
            .populate('createdBy', 'name email')
            .populate('assignedViewers', 'name email')
            .populate('pendingViewers', 'name email');
    } else if (req.user.role === 'Viewer') {
        projects = await Project.find({ assignedViewers: req.user._id })
            .populate('createdBy', 'name email')
            .populate('assignedViewers', 'name email');
    }

    res.status(200).json(new ApiResponse(200, projects, 'Projects fetched successfully'));
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (Admin, Engineer)
export const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (req.user.role === 'Engineer') {
        const projectCount = await Project.countDocuments({ createdBy: req.user._id });
        if (projectCount >= 5) {
            throw new ApiError(403, 'Engineers can only create up to 5 projects.');
        }
    }

    const project = await Project.create({
        name,
        description,
        createdBy: req.user._id,
        status: 'Active'
    });

    if (req.user.role === 'Engineer') {
        const admins = await User.find({ role: 'Admin' });
        const notifications = admins.map((admin) => ({
            userId: admin._id,
            message: `Engineer ${req.user.name} created a new project: ${project.name}`,
            relatedProject: project._id,
        }));
        await Notification.insertMany(notifications);
    }

    res.status(201).json(new ApiResponse(201, project, 'Project created successfully'));
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin, Engineer)
export const updateProject = asyncHandler(async (req, res) => {
    let project = await Project.findById(req.params.id);

    if (!project) {
        throw new ApiError(404, 'Project not found');
    }

    if (req.user.role === 'Engineer' && project.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Not authorized to update this project');
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json(new ApiResponse(200, project, 'Project updated successfully'));
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin, Engineer)
export const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        throw new ApiError(404, 'Project not found');
    }

    if (req.user.role === 'Engineer' && project.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Not authorized to delete this project');
    }

    await Project.deleteOne({ _id: req.params.id });

    res.status(200).json(new ApiResponse(200, null, 'Project removed successfully'));
});

// @desc    Assign viewers to a project
// @route   PUT /api/projects/:id/assign
// @access  Private (Admin, Engineer)
export const assignViewers = asyncHandler(async (req, res) => {
    const { viewerIds } = req.body; // Expecting an array of user IDs

    const project = await Project.findById(req.params.id);

    if (!project) {
        throw new ApiError(404, 'Project not found');
    }

    if (req.user.role === 'Engineer' && project.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Not authorized to assign viewers to this project');
    }

    // Validate that all provided IDs correspond to users with the 'Viewer' role
    const viewers = await User.find({ _id: { $in: viewerIds }, role: 'Viewer' });

    if (viewers.length !== viewerIds.length) {
        throw new ApiError(400, 'One or more users are not valid Viewers');
    }

    if (req.user.role === 'Engineer') {
        // Engineers can only request to add viewers (goes to pending)
        // Filter out ones already assigned
        const existingAssigned = project.assignedViewers.map(id => id.toString());
        const newPending = viewerIds.filter(id => !existingAssigned.includes(id));

        project.pendingViewers = newPending;
        await project.save();

        if (newPending.length > 0) {
            const admins = await User.find({ role: 'Admin' });
            if (admins.length > 0) {
                const notifications = admins.map((admin) => ({
                    userId: admin._id,
                    message: `Engineer ${req.user.name} requested to assign new viewers to project: ${project.name}. Waiting for approval.`,
                    relatedProject: project._id,
                }));
                await Notification.insertMany(notifications);
            }
        }
    } else if (req.user.role === 'Admin') {
        // Admins assign directly
        const existingViewerIdsString = project.assignedViewers.map(id => id.toString());
        const newViewerIds = viewerIds.filter((id) => !existingViewerIdsString.includes(id));

        project.assignedViewers = viewerIds;
        await project.save();

        if (newViewerIds.length > 0) {
            const notifications = newViewerIds.map((vId) => ({
                userId: vId,
                message: `You have been assigned to project ${project.name}`,
                relatedProject: project._id,
            }));
            await Notification.insertMany(notifications);
        }
    }

    res.status(200).json(new ApiResponse(200, project, 'Viewers processed successfully'));
});

// @desc    Approve pending viewers to a project
// @route   PUT /api/projects/:id/approve
// @access  Private (Admin only)
export const approveViewers = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        throw new ApiError(404, 'Project not found');
    }

    if (project.pendingViewers.length === 0) {
        throw new ApiError(400, 'No pending viewers to approve');
    }

    const newViewers = project.pendingViewers;
    project.assignedViewers = [...new Set([...project.assignedViewers, ...newViewers])];
    project.pendingViewers = [];
    await project.save();

    // Notify the newly approved viewers
    const notifications = newViewers.map((vId) => ({
        userId: vId,
        message: `Admin approved your assignment to project ${project.name}`,
        relatedProject: project._id,
    }));
    await Notification.insertMany(notifications);

    res.status(200).json(new ApiResponse(200, project, 'Viewers approved successfully'));
});

// @desc    Reject pending viewers to a project
// @route   PUT /api/projects/:id/reject
// @access  Private (Admin only)
export const rejectViewers = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        throw new ApiError(404, 'Project not found');
    }

    project.pendingViewers = [];
    await project.save();

    res.status(200).json(new ApiResponse(200, project, 'Pending viewers rejected'));
});
