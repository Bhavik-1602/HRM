import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "./hr/employee.validation.js";
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateEmployeeProfileSchema,
} from "./employee/employee.validation.js";
import {
  employeeCheckInSchema,
  employeeCheckOutSchema,
} from "./employee/attendance.validation.js";
import {
  hrCheckInSchema,
  hrCheckOutSchema,
  addAttendanceSchema,
  editAttendanceSchema
} from "./hr/attendance.validation.js";
import { adminLoginSchema, adminForgetPasswordSchema,  changePasswordSchema, updateAdminProfileSchema} from "./admin/admin.validation.js";
import { hrLoginSchema, hrForgetPasswordSchema, updateHrProfileSchema } from "./hr/hr.validation.js";
import {
  employeeTypeSchema,
  updateLeaveBalanceSchema,
} from "./hr/employeeType.validation.js";
import { leaveTypeSchema } from "./hr/leaveType.validation.js";
import { approveLeaveSchema } from "./hr/approveLeave.validation.js";
import { leaveBalanceSchema } from "./hr/leaveBalance.validation.js";
import {createHolidayValidation, updateHolidayValidation} from './hr/holiday.validation.js'

export {
  employeeTypeSchema,
  updateLeaveBalanceSchema,
  leaveBalanceSchema,
  leaveTypeSchema,
  approveLeaveSchema,
  loginSchema,
  forgotPasswordSchema,
  hrForgetPasswordSchema,
  adminForgetPasswordSchema,
  resetPasswordSchema,
  employeeCheckInSchema,
  employeeCheckOutSchema,
  hrCheckInSchema,
  hrCheckOutSchema,
  adminLoginSchema,
  hrLoginSchema,
  updateEmployeeSchema,
  createEmployeeSchema,
  updateAdminProfileSchema,
  updateHrProfileSchema,
  updateEmployeeProfileSchema,
  createHolidayValidation,
  updateHolidayValidation,
  changePasswordSchema,
  addAttendanceSchema,
  editAttendanceSchema
};
