import Task from "../models/Task.js"
import excelJS from "exceljs"
import User from "../models/User.js";

export const exportTaskReport = async (req, res) => {

    try {
        const tasks = await Task.find().populate('assignTo', 'name email');

        // Create a new Excel workbook
        const workBook = new excelJS.Workbook();
        const workSheet = workBook.addWorksheet('Tasks Report');

        // Set column headers
        workSheet.columns = [
            { header: 'Task ID', key: '_id', width: 25 },
            { header: 'title', key: 'title', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Priority', key: 'priority', width: 15 },
            { header: 'Status', key: 'status', width: 20 },
            { header: 'Due Date', key: 'dueDate', width: 20 },
            { header: 'Assigned To', key: 'assignTo', width: 30 },
        ]

        // Add data to the worksheet
        tasks.forEach(task => {
            const assignTo = task.assignTo.map(user => `${user.name} (${user.email})`).join(', ');
            workSheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate.toISOString().split('T')[0],
                assignTo: assignTo || "Unassigned",
            })
        })

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=task_report.xlsx"
        );

        return workBook.xlsx.write(res).then(() => {
            res.end();
        });
    } catch (error) {
        return res.status(400).json({ message: "Error while exporting task report", error: error.message });
    }
}


export const exportUserTaskReport = async (req, res) => {
    try {
        const users = await User.find().select("name email _id");
        const userTasks = await Task.find().populate('assignTo', 'name email _id');

        // Create a map to store user task counts
        const userTaskMap = {}

        // Loop through tasks and update user task counts
        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTask: 0,
                inProgressTask: 0,
                completedTask: 0,
            }
        })

        // Loop through tasks and update user task counts
        userTasks.forEach((task) => {
            if (task.assignTo) {
                task.assignTo.forEach((assignedUser) => {
                    if (userTaskMap[assignedUser._id]) {
                        userTaskMap[assignedUser._id].taskCount += 1;
                        if (task.status === "Pending") {
                            userTaskMap[assignedUser._id].pendingTasks += 1;
                        } else if (task.status === "In Progress") {
                            userTaskMap[assignedUser._id].inProgressTasks += 1;
                        } else if (task.status === "Completed") {
                            userTaskMap[assignedUser._id].completedTasks += 1;
                        }
                    }
                });
            }
        });

        // Create a new Excel workbook
        const workBook = new excelJS.Workbook();
        const workSheet = workBook.addWorksheet('User Task Report');

        // Set column headers
        workSheet.columns = [
            { header: "User Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 40 },
            { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
            { header: "Pemding Task", key: "pendingTask", width: 20 },
            { header: "In Progress Task", key: "inProgressTask", width: 20 },
            { header: "Completed Task", key: "completedTask", width: 20 },
        ]

        // Add data to the worksheet
        Object.values(userTaskMap).forEach(user => {
            workSheet.addRow(user)
        })

        // Set response headers
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=user_report.xlsx"
        )

        return workBook.xlsx.write(res).then(() => {
            res.end();
        })
    } catch (error) {
        return res.status(400).json({ message: "Error while exporting user task report", error: error.message });
    }
}

