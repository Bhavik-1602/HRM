import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../../../config/responseHandler.config.js";
import {
  AttendanceModel,
  EmployeeModel
} from "../../../../models/index.js";
import {
  getTodayDate,
  getDateFilter
} from "../../../../utils/commonUtils.js";
import { EMPLOYEE_MESSAGES } from "../../../../config/constants/responseMessage/employee/employee.message.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import {isValidObjectId} from '../../../../utils/commonUtils.js'

//Check-in API - Marks an employee's attendance by creating a new check-in entry.
const employeeCheckIn = async (req, res) => {
  try {
    const { employee_id } = req.body;
    // Validate employee ID
    if (!isValidObjectId(employee_id)) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        EMPLOYEE_MESSAGES.INVALID_USER_ID
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    // Check if the employee exists
     const employee = await EmployeeModel.findById(employee_id);

    if (!employee) { 
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        COMMON_MESSAGES.USER_NOT_EXIST
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    const today = getTodayDate();

    // Find existing attendance record for today
    let attendance = await AttendanceModel.findOne({employee_id, date: today });
    if (!attendance) {
      attendance = new AttendanceModel({
        employee_id: employee_id,
        date: today,
        sessions: [],
      });
    }

    // Ensure the employee hasn't already checked in without checking out
    const last_session = attendance.sessions[attendance.sessions.length - 1];
    if (last_session && !last_session.check_out_time) {
      const response = sendSuccessResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        EMPLOYEE_MESSAGES.USER_ALREADY_CHECKED_IN
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    // Add a new check-in session
    attendance.sessions.push({ check_in_time: new Date() });

    await attendance.save();

    const response = sendSuccessResponse(
      STATUS_CODES.CREATED,
      attendance,
      EMPLOYEE_MESSAGES.CHECK_IN
    );
    return res.status(STATUS_CODES.CREATED).json(response);
  } catch (error) {
    console.log(error);
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      COMMON_MESSAGES.SERVER_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

//Check-out API - Marks an employee's check-out time and calculates session duration.
const employeeCheckOut = async (req, res) => {
  try {
    const { employee_id } = req.body;

    // Validate employee ID
    if (!isValidObjectId(employee_id)) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        EMPLOYEE_MESSAGES.INVALID_USER_ID
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    const today = getTodayDate();

    // Find the attendance record for today
    const attendance = await AttendanceModel.findOne({ employee_id, date: today });

    if (!attendance) {
      const response = sendSuccessResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        EMPLOYEE_MESSAGES.USER_NOT_CHECKED
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    const last_session = attendance.sessions[attendance.sessions.length - 1];

    // Ensure the employee has checked in before checking out
    if (!last_session || last_session.check_out_time) {
      const response = sendSuccessResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        EMPLOYEE_MESSAGES.USER_ALREADY_CHECKED_OUT
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }
    // Set check-out time and calculate duration
    last_session.check_out_time = Date.now(); // Use milliseconds timestamp
    last_session.duration =
      last_session.check_out_time - last_session.check_in_time; // Store in milliseconds
    attendance.total_duration += last_session.duration;

    await attendance.save();

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      attendance,
      EMPLOYEE_MESSAGES.CHECK_OUT
    );
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    console.log(error);
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      COMMON_MESSAGES.SERVER_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

// Get Attendance Records API - Fetches attendance records with filters and pagination.
const getEmployeeAttendanceRecords = async (req, res) => {
  try {
    const { start_date, end_date, month, year, page = 1, limit = 10 } = req.query;

    // Filter only the logged-in employee's records
    let filter = { employee_id: req.user.id }; 

    // Apply date filtering (same as before)
    filter = { ...filter, ...getDateFilter(start_date, end_date, month, year) };

    // Fetch attendance records
    const attendanceRecords = await AttendanceModel.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      attendanceRecords,
      EMPLOYEE_MESSAGES.ATTENDANCE_RETRIEVED
    );
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    console.log(error);
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      COMMON_MESSAGES.SERVER_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

export default { employeeCheckIn, employeeCheckOut, getEmployeeAttendanceRecords };
