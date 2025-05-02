import express from "express";
import authRoutes from './auth.routes.js'
import leaveUpdateRoutes from './leaveapprove.routes.js'
import employeeRoutes from "./employee.routes.js";
import hrRoutes from "./hr.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import holidayRoutes from "./holiday.routes.js";
import leaveRoutes from "./leave.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/manageleaves", leaveUpdateRoutes);
router.use("/employee",  employeeRoutes);
router.use("/hr",  hrRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/holiday", holidayRoutes);
router.use("/leaves", leaveRoutes);

export default router;
