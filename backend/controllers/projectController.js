import Project from '../models/Project.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Get all projects according to role
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
    try {
        let projects;

        if (req.user.role === 'Admin') {
            projects = await Project.find().populate('createdBy', 'name email').populate('assignedViewers', 'name email');
        } else if (req.user.role === 'Engineer') {
            projects = await Project.find({ createdBy: req.user._id }).populate('createdBy', 'name email').populate('assignedViewers', 'name email');
        } else if (req.user.role === 'Viewer') {
            projects = await Project.find({ assignedViewers: req.user._id }).populate('createdBy', 'name email').populate('assignedViewers', 'name email');
        }

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (Admin, Engineer)
export const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (req.user.role === 'Engineer') {
            const projectCount = await Project.countDocuments({ createdBy: req.user._id });
            if (projectCount >= 5) {
                return res.status(403).json({ message: 'Engineers can only create up to 5 projects.' });
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

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin, Engineer)
export const updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (req.user.role === 'Engineer' && project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin, Engineer)
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (req.user.role === 'Engineer' && project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this project' });
        }

        await Project.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Assign viewers to a project
// @route   PUT /api/projects/:id/assign
// @access  Private (Admin, Engineer)
export const assignViewers = async (req, res) => {
    try {
        const { viewerIds } = req.body; // Expecting an array of user IDs

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (req.user.role === 'Engineer' && project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to assign viewers to this project' });
        }

        // Validate that all provided IDs correspond to users with the 'Viewer' role
        const viewers = await User.find({ _id: { $in: viewerIds }, role: 'Viewer' });

        if (viewers.length !== viewerIds.length) {
            return res.status(400).json({ message: 'One or more users are not valid Viewers' });
        }

        // Find newly assigned viewers to send notifications only to them
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

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
