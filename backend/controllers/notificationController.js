import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ userId: req.user._id })
        .populate('relatedProject', 'name')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, notifications, 'Notifications fetched successfully'));
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        throw new ApiError(404, 'Notification not found');
    }

    // Check if notification belongs to user
    if (notification.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Not authorized');
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read'));
});
