import authController from "./auth/auth.controller.js";
import employeeController from './employee/employee.controller.js';
import hrController from './hr/hr.controller.js';
import forgotPasswordController from "./auth/forgetPassword.contoller.js";
import changePasswordController from "./auth/changePassword.controller.js";
import createOrUpdateLeaveTypeController from "./leave/leave.type.controller.js";
import createOrUpdateEmployeeTypeController from "./leave/employee.type.controller.js";
import createOrUpdateLeaveBalanceController from "./leave/leavebalance.controller.js";
import approveleaveController from "./leave/approveleave.controller.js";
import attendanceController from './attendance/attendance.controller.js'
import fetchAllEmployeeLeavesController from './leave/getemployeeleaves.controller.js'
import holidayController from './holiday/holiday.controller.js'
import leaveController from './leave/leave.controller.js';

export const { login } = authController;
export const { forgotPassword, resetPassword } = forgotPasswordController;
export const { changeHrPassword } = changePasswordController;
export const { createEmployee, getEmployeeById, getAllEmployees, updateEmployee, deleteEmployee } = employeeController;
export const { hrCheckIn, hrCheckOut, getHRAttendanceRecords, addEmployeeAttendance, editEmployeeAttendance } = attendanceController;
export const {getHrProfile, updateHrProfile} = hrController;
export const { approveLeaveRequest } = approveleaveController;
export const { createOrUpdateLeaveType, getAllLeaveTypes } = createOrUpdateLeaveTypeController;
export const { createOrUpdateEmployeeType, updateLeaveBalances, getAllEmployeeTypes } = createOrUpdateEmployeeTypeController;
export const { createOrUpdateLeaveBalance } = createOrUpdateLeaveBalanceController;
export const { getAllAppliedLeaves } = fetchAllEmployeeLeavesController;
export const { createHoliday, getAllHolidays, getHolidayById, updateHoliday, deleteHoliday } = holidayController;
export const { applyLeave, editLeaveRequest, getHrLeaves, getHrLeaveBalance } = leaveController;
