import express from "express";
import authRoutes from './auth.routes.js'
import holidayRoutes from './holiday.routes.js'
import adminRoutes from './admin.routes.js'
import manageleaves from './leaveapprove.routes.js'
import employeeRoutes from './employee.routes.js';
import hrRoutes from './hr.routes.js';

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/holiday", holidayRoutes);
router.use("/admin", adminRoutes);
router.use("/manageleaves", manageleaves);
router.use("/employee", employeeRoutes);
router.use("/hr", hrRoutes);

export default router;
