export const BASE_URL = 'http://localhost:3000'


export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
    },
    USERS: {
        GET_ALL_USERS: "/api/users/",
        GET_USER_BY_ID: (userId) => `/api/users/${userId}`,
        CREATE_USER: "/api/users", // Create a new user (Admin only)
        UPATE_USER: (userId) => `/api/users/${userId}`, // Update a user
        DELETE_USER: (userId) => `/api/users/${userId}`, // Delete a user 
    },

    TASKS_API: {
        GET_DASHBOARD_DATA: "/api/tasks/getDashboardData", // Get Dashboard Data
        GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Get User Dashboard Data
        GET_ALL_TASKS: "/api/tasks/", // Get all tasks (Admin: all, User: only assigned tasks)
        GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Get task by ID
        CREATE_TASK: "/api/tasks/create-task", // Create a new task (Admin only)
        UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Update task details
        DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Delete a task (Admin only)

        UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Update task status
        UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Update todo checklist
    },


    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image",
    }
}
