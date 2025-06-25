import mongoose from "mongoose";
import Task from "../models/Task.js";



export const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            assignTo,
            priority,
            dueDate,
            attachment,
            todoCheckList,
        } = req.body

        if (!Array.isArray(assignTo)) {
            return res.status(400).json({ message: "assignTo must be an array" });
        }

        const task = await Task.create({
            title,
            description,
            assignTo,
            priority,
            dueDate,
            attachment,
            todoCheckList,
            createdBy: req.user._id
        })

        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        return res.status(400).json({ message: "Error while creating task", error: error.message });
    }
}


// export const getTask = async (req, res) => {
//     try {
//         const { status } = req.query;
//         let filter = {}

//         if (status) {
//             filter.status = status;
//         }

//         let tasks;

//         if (req.user.role === "admin") {
//             tasks = await Task.find(filter).populate("assignTo", "name email profileImageUrl")
//         } else {
//             tasks = await Task.find({ ...filter, assignTo: req.user._id }).populate("assignTo", "name email profileImageUrl")
//         }

//         // Add comments todochecklist count to each task
//         tasks = await Promise.all(
//             tasks.map(async (task) => {
//                 const completedCount = task.todoCheckList.filter((item) => item.completed).length;
//                 return {...tasks._doc, completedTotoCount: completedCount};
//             })
//         )

//         // Status summary count
//         const allTasks= await Task.countDocuments(
//             req.user.role === 'admin'? {} : { assignTo: req.user._id }
//         );

//         const pendingTasks= await Task.countDocuments({
//             ...filter,
//             status: "Pending",
//             ...(req.user.role !== 'admin' &&  { assignTo: req.user._id })

//         });

//         const inProgressTasks= await Task.countDocuments({
//             ...filter,
//             status: "In Progress",
//             ...(req.user.role !== 'admin' &&  { assignTo: req.user._id })

//         });

//         const completedTasks= await Task.countDocuments({
//             ...filter,
//             status: "Completed",
//             ...(req.user.role !== 'admin' &&  { assignTo: req.user._id })   

//         });

//         res.json({
//             tasks,
//             statusSummary: {
//                 all:allTasks,
//                 pendingTasks,
//                 inProgressTasks,
//                 completedTasks
//             }
//         })


//     } catch (error) {
//         return res.status(400).json({ message: "Error while getting tasks", error: error.message });
//     }
// }


export const getTask = async (req, res) => {
    try {
        const { status } = req.query;

        // Base match stage for both tasks and summary, conditionally adding assignTo filter
        const baseMatchFilter = {};
        if (status) {
            baseMatchFilter.status = status;
        }

        // Add assignTo filter if user is not admin
        if (req.user.role !== "admin") {
            baseMatchFilter.assignTo = req.user._id;
        }

        // --- Aggregation Pipeline for Tasks ---
        const tasksPipeline = [
            {
                $match: baseMatchFilter // Apply initial filtering
            },
            {
                $lookup: { // Populate 'assignTo' field from 'users' collection
                    from: "users",
                    localField: "assignTo",
                    foreignField: "_id",
                    as: "assignedToDetails" // Renamed from 'userDetails' to 'assignedToDetails'
                    // This will hold the array of matched user documents
                }
            },
            {
                $unwind: { // Deconstruct the 'assignedToDetails' array (assuming one assignee per task)
                    path: "$assignedToDetails",
                    preserveNullAndEmptyArrays: true // Keep tasks even if assignee is not found
                }
            },
            {
                $addFields: { // Add the calculated 'completedTotoCount' field
                    completedTotoCount: {
                        $size: {
                            $filter: {
                                input: "$todoCheckList",
                                as: "item",
                                cond: { $eq: ["$$item.completed", true] }
                            }
                        }
                    }
                }
            },
            {
                $project: { // Shape the output to match your desired structure
                    _id: 1,
                    title: 1,
                    description: 1,
                    priority: 1,
                    status: 1,
                    dueDate: 1,
                    attachment: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    createdBy: { $arrayElemAt: ["$createdBy", 0] }, // This will remain as the ObjectId as it's not populated
                    progress: 1, // Include progress directly as it's a top-level field
                    completedTotoCount: 1, // Include the calculated count

                    // Reconstruct the 'assignedTo' field as a nested object
                    // using fields from 'assignedToDetails'
                    assignedTo: {
                        _id: "$assignedToDetails._id",
                        name: "$assignedToDetails.name",
                        email: "$assignedToDetails.email",
                        profileImageUrl: "$assignedToDetails.profileImageUrl"
                    },
                    todoCheckList: 1,
                }
            }
        ];

        const tasks = await Task.aggregate(tasksPipeline);

        // --- Aggregation Pipeline for Status Summary (remains unchanged) ---
        const summaryMatchFilter = {};
        if (req.user.role !== 'admin') {
            summaryMatchFilter.assignTo = req.user._id;
        }

        const statusSummaryPipeline = [
            { $match: summaryMatchFilter },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    all: { $sum: "$count" },
                    pendingTasks: { $sum: { $cond: [{ $eq: ["$_id", "Pending"] }, "$count", 0] } },
                    inProgressTasks: { $sum: { $cond: [{ $eq: ["$_id", "In Progress"] }, "$count", 0] } },
                    completedTasks: { $sum: { $cond: [{ $eq: ["$_id", "Completed"] }, "$count", 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    all: 1,
                    pendingTasks: 1,
                    inProgressTasks: 1,
                    completedTasks: 1
                }
            }
        ];

        const statusSummaryResult = await Task.aggregate(statusSummaryPipeline);

        // Ensure statusSummary is always an object, even if no tasks are found
        const formattedStatusSummary = statusSummaryResult.length > 0 ? statusSummaryResult[0] : {
            all: 0,
            pendingTasks: 0,
            inProgressTasks: 0,
            completedTasks: 0
        };

        res.json({
            tasks,
            statusSummary: formattedStatusSummary
        });

    } catch (error) {
        console.error("Error while getting tasks:", error); // Keep this for debugging
        return res.status(400).json({ message: "Error while getting tasks", error: error.message });
    }
};



export const getTaskById = async (req, res) => {
    try {
        const task = await Task.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "assignTo",
                    foreignField: "_id",
                    as: "assignedToDetails"
                }
            },
            {
                $unwind: {
                    path: "$assignedToDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    priority: 1,
                    status: 1,
                    dueDate: 1,
                    attachment: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    createdBy: { $arrayElemAt: ["$createdBy", 0] },
                    progress: 1,
                    assignedTo: {
                        _id: "$assignedToDetails._id",
                        name: "$assignedToDetails.name",
                        email: "$assignedToDetails.email",
                        profileImageUrl: "$assignedToDetails.profileImageUrl"
                    },
                    todoCheckList: 1
                }
            }
        ])

        return res.status(200).json(task)
    } catch (error) {
        return res.status(400).json({ message: "Error while getting task", error: error.message });
    }
}


export const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id
        const updateData = { ...req.body }

        if (updateData.status !== undefined) {
            delete updateData.status
        }
        if (updateData.assignTo !== undefined) {
            if (!Array.isArray(updateData.assignTo)) {
                return res.status(400).json({ message: "assignTo must be an array" });
            }
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            updateData,
            { new: true }
        )

        if (!updatedTask) {
            return res.status(404).json({ message: "Task does not exist" });
        }

        return res.status(200).json({ message: "Task updated successfully", task: updatedTask })

    } catch (error) {
        return res.status(400).json({ message: "Error while updating task", error: error.message });
    }
}


export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id

        const deletedTask = await Task.findByIdAndDelete(taskId)

        if (!deletedTask) {
            return res.status(404).json({ message: "Task does not exist" });
        }

        return res.status(200).json({ message: "Task deleted successfully", task: deletedTask })
    }
    catch (error) {
        return res.status(400).json({ message: "Error while deleting task", error: error.message });
    }
}


export const updateTaskStatus = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { status } = req.body

        const task = await Task.findById(taskId)
        if (!task) {
            return res.status(404).json({ message: "Task does not exist" });
        }

        const isAssigned = task.assignTo.some((userId) => userId.toString() === req.user._id.toString())
        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to update this task" });
        }

        const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true })
        if (!updatedTask) {
            return res.status(404).json({ message: "Task does not exist" });
        }

        if (status === 'Completed') {
            await Task.findByIdAndUpdate(
                taskId,
                {
                    $set: {
                        'todoCheckList.$[].completed': true
                    }
                },
                { new: true }
            )
        }

        return res.status(200).json({ message: "Task updated successfully", task: updatedTask })

    } catch (error) {
        return res.status(400).json({ message: "Error while updating task status", error: error.message });
    }
}



export const updateTaskCheckList = async (req, res) => {
    const taskId = req.params.id;
    const { todoCheckList } = req.body; // Destructure the todoCheckList from the request body

    try {
        // 1. Find the task to perform authorization check
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        // 2. Authorization Check
        // Ensure task.assignTo is an array, then check if user is assigned or admin
        const assignedUsers = Array.isArray(task.assignTo) ? task.assignTo : [];
        const isAssigned = assignedUsers.some((userId) => userId.toString() === req.user._id.toString());

        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to update this task." });
        }

        // 3. Calculate new progress and status based on the incoming todoCheckList
        const completedCount = todoCheckList.filter((item) => item.completed).length;
        const totalItems = todoCheckList.length;

        // Calculate progress, defaulting to 0 if no items
        const newProgress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        let newStatus;
        if (newProgress === 100) {
            newStatus = "Completed";
        } else if (newProgress > 0) {
            newStatus = "In Progress"; // Corrected typo here
        } else {
            newStatus = "Pending";
        }

        // 4. Prepare the update object for the database
        const updateFields = {
            todoCheckList: todoCheckList, // Update the entire checklist with the incoming data
            progress: newProgress,
            status: newStatus
        };

        // 5. Perform the single, atomic update operation
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $set: updateFields }, // Use $set to update specific fields
            {
                new: true,         // Return the modified document
                populate: { // Populate assignedTo directly in this query
                    path: 'assignTo',
                    select: 'name email profileImageUrl'
                }
            }
        );

        // This check is a final safeguard, though it should ideally be caught by the first !task check
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found after update attempt." });
        }

        // 6. Success Response
        return res.status(200).json({ message: "Task checklist updated successfully", task: updatedTask });

    } catch (error) {
        // Generic server error for any other unexpected issues
        return res.status(500).json({ message: "An unexpected error occurred while updating task checklist.", error: error.message });
    }
};


export const getDashboardData = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments({});
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const overdueTasks = await Task.countDocuments({
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        });

        // Ensure all task statuses included
        const taskStatus = ["Pending", "In Progress", "Completed"];
        const taskDistributionRow = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ])

        const taskDistribution = taskStatus.reduce((acc, status) => {
            const formatedKey = status.replace(/\s+/g, "_")
            acc[formatedKey] = taskDistributionRow.find(row => row._id === status)?.count || 0;
            return acc;
        }, {});

        taskDistribution['All'] = totalTasks;

        // Esuring all task priorities included
        const taskPriorityLevelsrow = ["Low", "Medium", "High"];
        const taskPriorityLevels = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ])

        const taskPriority = taskPriorityLevelsrow.reduce((acc, priority) => {
            const formatedKey = priority.replace(/\s+/g, "_")
            acc[formatedKey] = taskPriorityLevels.find(row => row._id === priority)?.count || 0;
            return acc;
        }, {});

        // Fetch recent 10 tasks
        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title status priority dueDate createdAt');

        return res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriority
            },
            recentTasks
        });
    } catch (error) {
        return res.status(500).json({ message: "An unexpected error occurred while fetching dashboard data.", error: error.message });
    }
}


export const getUserDashboardData = async (req, res) => {
    try {
        // console.log(req.user);
        const userId = req.user._id;
        // console.log(userId);

        // Fetch statistics for user specific tasks (already correct with $in)
        const totalTasks = await Task.countDocuments({ assignTo: userId });
        const pendingTasks = await Task.countDocuments({ assignTo: userId, status: "Pending" });
        const completedTasks = await Task.countDocuments({ assignTo: userId, status: "Completed" });
        const overdueTasks = await Task.countDocuments({
            assignTo: userId,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        });

        // Task distribution by user
        const taskStatus = ["Pending", "In Progress", "Completed"];
        const taskDistributionRow = await Task.aggregate([
            { // Match tasks assigned to the user
                $match: { assignTo: userId }
            },
            { // Group tasks by status  
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const taskDistribution = taskStatus.reduce((acc, status) => {
            const formatedKey = status.replace(/\s+/g, "_")
            acc[formatedKey] = taskDistributionRow.find(row => row._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution['All'] = totalTasks;

        // Task distribution by priority
        const taskPriorityLevelsrow = ["Low", "Medium", "High"];
        const taskPriorityLevels = await Task.aggregate([
            {// Match tasks assigned to the user
                $match: { assignTo: userId }
            },
            { // Group tasks by priority
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);

        const taskPriority = taskPriorityLevelsrow.reduce((acc, priority) => {
            const formatedKey = priority.replace(/\s+/g, "_")
            acc[formatedKey] = taskPriorityLevels.find(row => row._id === priority)?.count || 0;
            return acc;
        }, {});

        // Fetch recent 10 tasks for the logged in user (already correct with $in)
        const recentTasks = await Task.find({ assignTo: { $in: [userId] } })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title status priority dueDate createdAt');

        return res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriority
            },
            recentTasks
        });

    } catch (error) {
        return res.status(500).json({
            message: "An unexpected error occurred while fetching dashboard data.",
            error: error.message,
        });
    }
};

