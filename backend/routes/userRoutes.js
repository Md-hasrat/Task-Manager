import { Router } from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import { getUserById, getUsers } from "../controllers/userController.js";

const router = Router();

router.get('/',protect,adminOnly,getUsers)  // Get all users (Admin only)
router.get('/:id',protect,getUserById)  // Get specific user by id 



export default router
