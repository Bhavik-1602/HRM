// Authentication
export const LOGIN_URL=`/api/employee/v1/auth/login`;
export const FORGOT_PASSWORD_URL=`/api/employee/v1/auth/forgot-password`;
export const RESET_PASSWORD_URL=`/api/employee/v1/auth/reset-password`;
export const CHANGE_PASSWORD_URL=`/api/employee/v1/auth/change-password`;

// Attendance
export const CHECKIN_URL = `/api/employee/v1/attendance/check-in`;
export const CHECKOUT_URL = `/api/employee/v1/attendance/check-out`;
export const ATTENDANCE_URL = `/api/employee/v1/attendance/records`; 

// Leave
export const LEAVE_URL = `/api/employee/v1/leaves/records`;
export const LEAVE_APPLY_URL = `/api/employee/v1/leaves/apply`;
export const LEAVE_UPDATE_URL = `/api/employee/v1/leaves`;
export const LEAVE_DELETE_URL = `/api/employee/v1/leaves`;
export const LEAVE_BALANCE_URL = `/api/employee/v1/leaves/balance`;
export const GET_LEAVE_TYPES_URL = `/api/employee/v1/leaves/fetch-leavetype`;

// Account
export const GET_EMPLOYEE_DETAILS=`/api/employee/v1/employee/profile`;
export const UPDATE_EMPLOYEE_DETAILS=`/api/employee/v1/employee/edit`;