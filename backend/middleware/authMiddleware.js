import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        const currentRole = req.user?.role ? req.user.role.toLowerCase() : '';

        // Admin gets absolute full access to everything in the system
        if (currentRole === 'admin') {
            return next();
        }

        const allowedRoles = roles.map(r => r.toLowerCase());

        if (!allowedRoles.includes(currentRole)) {
            return res.status(403).json({
                message: `User role ${req.user?.role || 'undefined'} is not authorized.`,
            });
        }
        next();
    };
};
