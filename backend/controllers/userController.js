import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.status(200).json(new ApiResponse(200, users, 'Users fetched successfully'));
});

// @desc    Get Viewers only
// @route   GET /api/users/viewers
// @access  Private
export const getViewers = asyncHandler(async (req, res) => {
    const viewers = await User.find({ role: 'Viewer' }).select('_id name email role');
    res.status(200).json(new ApiResponse(200, viewers, 'Viewers fetched successfully'));
});

// @desc    Update user role
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    user.role = req.body.role || user.role;
    const updatedUser = await user.save();

    res.status(200).json(
        new ApiResponse(200, {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        }, 'User updated successfully')
    );
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    await user.deleteOne();
    res.status(200).json(new ApiResponse(200, null, 'User removed successfully'));
});
