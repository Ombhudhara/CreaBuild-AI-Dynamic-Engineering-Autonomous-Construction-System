export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated to access this route' });
        }

        const currentRole = req.user.role ? req.user.role.toLowerCase() : '';
        const allowedRoles = roles.map(r => r.toLowerCase());

        // Check if the user's role exists in the allowed roles array
        if (!allowedRoles.includes(currentRole)) {
            return res.status(403).json({
                message: `User role '${req.user.role}' is not authorized to access this route`,
            });
        }
        next();
    };
};
