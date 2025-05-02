import express from "express";
import attendanceRoutes from "./attendance.routes.js";
import authRoutes from "./auth.routes.js";
import leaveRoutes from "./leave.routes.js";
import employeeRoutes from "./employee.routes.js";
import holidayRoutes from "./holiday.routes.js";

const router = express.Router();

router.use("/attendance", attendanceRoutes);
router.use("/auth", authRoutes);
router.use("/employee", employeeRoutes);
router.use("/leaves", leaveRoutes);
router.use("/holiday", holidayRoutes);

export default router;
