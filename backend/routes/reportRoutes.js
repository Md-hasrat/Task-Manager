import { Router } from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import { exportTaskReport, exportUserTaskReport } from "../controllers/reportController.js";

const router = Router();

router.get('/export/tasks',protect,adminOnly,exportTaskReport)
router.get('/export/users',protect,adminOnly,exportUserTaskReport)


export  default router
