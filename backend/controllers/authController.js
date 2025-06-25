import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}


export const registerUser = async (req, res) => {
    const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please add all fields: name, email, password" });
    }
    try {
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPass = await bcrypt.hash(password, 10);

        // Determine user role (optional: based on adminInviteToken)
        let role = "member";

        if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
            role = "admin";
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashPass,
            profileImageUrl,
            role
        })

        // Check if user was created
        if (user) {
            // Generate token
            const token = generateToken(user._id);

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
                role: user.role,
                token: token
            })
        } else {
            return res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        return res.status(400).json({ message: "Error while registering user", error: error.message });
    }
}


export const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isPasswordMatch = await bcrypt.compare(password, userExist.password);

        if (isPasswordMatch) {
            const token = generateToken(userExist._id);
            res.status(200).json({
                _id: userExist._id,
                name: userExist.name,
                email: userExist.email,
                profileImageUrl: userExist.profileImageUrl,
                role: userExist.role,
                token: token
            })
        } else {
            return res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        return res.status(400).json({ message: "Error while logging in user", error: error.message });
    }
}


export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role
        })
    } else {
        return res.status(400).json({ message: "User profile does not exist" });
    }
}


export const updateUserProfile = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        // --- IMPORTANT: ONLY ALLOW SPECIFIC FIELDS TO BE UPDATED ---

        // Update basic profile information
        if (req.body.name) {
            user.name = req.body.name;
        }

        if (req.body.email) {
            user.email = req.body.email;
        }

        if (req.body.profileImageUrl) {
            user.profileImageUrl = req.body.profileImageUrl;
        }

        if (req.body.email) {
            const emailExists = await User.findOne({ email: req.body.email, _id: { $ne: userI } });
            if (emailExists) {
                return res.status(400).json({ message: "Email already exists" });
            }
            req.email = req.body.email;
        }

        if (req.body.password) {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            user.password = hashedPassword;
        }

        const updatedUser = await user.save();

        return res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profileImageUrl: updatedUser.profileImageUrl
        })
    } catch (error) {
        console.error("Error while updating user profile:", error);
        return res.status(400).json({ message: "Error while updating user profile", error: error.message });
    }
}
