import attendanceController from "./attendance/attendance.controller.js";
import authController from "./auth/auth.controller.js";
import forgotPasswordController from "./auth/forgotPassword.contoller.js";
import changePasswordController from "./auth/changePassword.controller.js";
import leaveController from './leave/leave.controller.js'
import employeeController from './employee/employee.controller.js'

export const { employeeCheckIn, employeeCheckOut, getEmployeeAttendanceRecords} = attendanceController;
export const { forgotPassword, resetPassword } = forgotPasswordController;
export const { changeEmployeePassword } = changePasswordController;
export const {applyLeave, editLeaveRequest, getEmployeeLeaves, getEmployeeLeaveBalance, getAllLeaveTypes } = leaveController;
export const { login } = authController;
export const {getEmployeeProfile, updateEmployeeProfile} = employeeController


