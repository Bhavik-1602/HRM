import authController from './auth/auth.controller.js';
import forgotPasswordController from "./auth/forgetPassword.contoller.js";
import changePasswordController from "./auth/changePassword.controller.js";
import adminController from "./admin/admin.controller.js";
import leaveTypeController from "./leave/leave.type.controller.js";
import employeeTypeController from "./leave/employee.type.controller.js";
import hrController from './hr/hr.controller.js';

export const { login } = authController;
export const { forgotPassword, resetPassword } = forgotPasswordController;
export const {changeAdminPassword } = changePasswordController;
export const {getAdminProfile, updateAdminProfile } = adminController;
export const { createOrUpdateLeaveType, getAllLeaveTypes } = leaveTypeController;
export const { createOrUpdateEmployeeType, updateLeaveBalances, getAllEmployeeTypes } = employeeTypeController;
export const { createHr, getHrById, getAllHrs, updateHr, deleteHr } = hrController;