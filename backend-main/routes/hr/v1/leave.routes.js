import express from "express";
import { applyLeave, getHrLeaves, getHrLeaveBalance, editLeaveRequest } from "../../../controllers/hr/v1/index.js";
import verifyHr from "../../../middlewares/verifyHr.middleware.js";
import { uploadMiddleware } from "../../../middlewares/multer.middleware.js";

const router = express.Router();

router.post('/apply', verifyHr, uploadMiddleware, applyLeave);
router.get('/records', verifyHr, getHrLeaves);
router.get('/balance', verifyHr, getHrLeaveBalance);
router.put('/:leaveId', verifyHr, uploadMiddleware, editLeaveRequest);

export default router;