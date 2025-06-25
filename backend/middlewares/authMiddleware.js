import User from "../models/User.js";
import jwt from "jsonwebtoken";


// Middleware to protect routes
export const protect = async (req, res, next) => {
    try {
         // Log all headers
        // console.log('Request Headers:', req.headers);
        const token = req.headers.authorization;
        // console.log('Token:', token);
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        }else {
            return res.status(401).json({ message: "Not authorized, no token" });
        }
    } catch (err) {
        return res.status(401).json({ message: "Token failed", error: err.message });
    }
}


// Middleware for only amdin access
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: "Access denied, admin only" });
    }
}

