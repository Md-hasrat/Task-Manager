import { Router } from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import { createTask, deleteTask, getDashboardData, getTask, getTaskById, getUserDashboardData, updateTask, updateTaskCheckList, updateTaskStatus } from "../controllers/taskController.js";

const router = Router();

router.post('/create-task',protect,adminOnly,createTask)
router.get('/get-task',protect,getTask)
router.get('/get-taskById/:id',protect,getTaskById)
router.get('/updateTask/:id',protect,updateTask)
router.post('/updateTask/:id',protect,updateTask)
router.post('/deleteTask/:id',protect,adminOnly,deleteTask)
router.post('/updateTaskStatus/:id',protect,adminOnly,updateTaskStatus)
router.post('/updateTaskCheckList/:id',protect,updateTaskCheckList)
router.get('/getDashboardData',protect,getDashboardData)
router.get('/getUserDashboardData',protect,getUserDashboardData)


export default router
