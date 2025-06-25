import express from 'express'
import User from '../models/User.js'
import Task from '../models/Task.js';


export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "member" }).select('-password');

        const userWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Pending"
                });
                const inProgressTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "In Progress"
                });
                const completedTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Completed"
                });
                return {
                    ...user._doc,
                    pendingTasks,
                    inProgressTasks,
                    completedTasks
                };

            })
        )

        return res.status(200).json(userWithTaskCounts);
    } catch (error) {
        return res.status(400).json({ message: "Error while getting users", error: error.message });
    }
}



export const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.status(200).json(user);
    } else {
        return res.status(400).json({ message: "User does not exist" });
    }
}

