import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../../../config/responseHandler.config.js";
import {
  AttendanceModel,
  HrModel,
  EmployeeModel,
} from "../../../../models/index.js";
import { getTodayDate, getDateFilter } from "../../../../utils/commonUtils.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import { EMPLOYEE_MESSAGES } from "../../../../config/constants/responseMessage/employee/employee.message.js";

// HR Check-in
const hrCheckIn = async (req, res) => {
  try {
    const { hr_id } = req.body;

    // Validate hr  ID
    if (!hr_id) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json(
          sendErrorResponse(STATUS_CODES.BAD_REQUEST, null, "HR ID is required")
        );
    }

    // Check if the employee exists
    const hr = await HrModel.findById(hr_id);
    if (!hr) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        COMMON_MESSAGES.USER_NOT_EXIST
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    const today = getTodayDate();

    // Find existing attendance record for today
    let attendance = await AttendanceModel.findOne({ hr_id, date: today });

    if (!attendance) {
      attendance = new AttendanceModel({ hr_id, date: today, sessions: [] });
    }

    // Ensure the hr hasn't already checked in without checking out
    const lastSession = attendance.sessions[attendance.sessions.length - 1];
    if (lastSession && !lastSession.check_out_time) {
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

// HR Check-out
const hrCheckOut = async (req, res) => {
  try {
    const { hr_id } = req.body;

    // Validate hr ID
    if (!hr_id) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        EMPLOYEE_MESSAGES.INVALID_USER_ID
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    const today = getTodayDate();
    // Find the attendance record for today
    const attendance = await AttendanceModel.findOne({ hr_id, date: today });

    if (!attendance) {
      const response = sendSuccessResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        EMPLOYEE_MESSAGES.USER_NOT_CHECKED
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    const lastSession = attendance.sessions[attendance.sessions.length - 1];

    // Ensure the employee has checked in before checking out
    if (!lastSession || lastSession.check_out_time) {
      const response = sendSuccessResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        EMPLOYEE_MESSAGES.USER_ALREADY_CHECKED_OUT
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    // Set check-out time and calculate duration
    lastSession.check_out_time = new Date();
    lastSession.duration =
      lastSession.check_out_time - lastSession.check_in_time;
    attendance.total_duration += lastSession.duration;

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

const getHRAttendanceRecords = async (req, res) => {
  try {
    const {
      hr_id,
      employee_id,
      start_date,
      end_date,
      month,
      year,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = {}; // Default: HR can see all employee attendance

    if (hr_id) {
      // HR can only see their own attendance when hr_id is provided
      filter.hr_id = hr_id;
    } else if (employee_id) {
      // HR filters for a specific employee
      filter.employee_id = employee_id;
    } else {
      // Fetch all employee IDs
      const employeeIds = await EmployeeModel.find({}, "_id");
      const employeeIdArray = employeeIds.map((emp) => emp._id);

      // HR should see all employees' attendance and their own
      filter.employee_id = { $in: [req.user.id, ...employeeIdArray] };
    }

    // Apply date filtering
    filter = { ...filter, ...getDateFilter(start_date, end_date, month, year) };

    // Fetch attendance records
    const attendanceRecords = await AttendanceModel.find(filter)
      .populate("employee_id", "first_name")
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

const addEmployeeAttendance = async (req, res) => {
  try {
    let { employee_id, date, check_in_time, check_out_time } = req.body;

    // Ensure they are properly parsed as Date objects
    check_in_time = new Date(check_in_time);
    check_out_time = new Date(check_out_time);
    date = new Date(date).toISOString().split("T")[0];

    // Check if the date is invalid
    if (isNaN(check_in_time.getTime()) || isNaN(check_out_time.getTime())) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        COMMON_MESSAGES.ALL_FIELDS_REQUIRED
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    // Validate check-in and check-out order
    if (check_out_time <= check_in_time) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        EMPLOYEE_MESSAGES.CHECK_IN_TIME_MUST_FIRST
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    const employeeExists = await EmployeeModel.findById(employee_id);
    if (!employeeExists) {
      const response = sendErrorResponse(
        STATUS_CODES.UNAUTHORIZED,
        null,
        EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND
      );
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }

    let attendance = await AttendanceModel.findOne({ employee_id, date });

    if (!attendance) {
      // Create new attendance if the employee missed check-in and check-out
      attendance = new AttendanceModel({
        employee_id,
        date,
        sessions: [{ check_in_time, check_out_time }],
        total_duration: check_out_time - check_in_time,
      });
    } else {
      // Add a new session manually
      attendance.sessions.push({ check_in_time, check_out_time });
      attendance.total_duration += check_out_time - check_in_time;
    }

    await attendance.save();

    const response = sendSuccessResponse(
      STATUS_CODES.CREATED,
      attendance,
      EMPLOYEE_MESSAGES.ATTENDANCE_ADDED
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

const editEmployeeAttendance = async (req, res) => {
  try {
    const { employee_id, date, session_index, check_in_time, check_out_time } =
      req.body;

    const employeeExists = await EmployeeModel.findById(employee_id);
    if (!employeeExists) {
      const response = sendErrorResponse(
        STATUS_CODES.UNAUTHORIZED,
        null,
        EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND
      );
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }

    const attendance = await AttendanceModel.findOne({ employee_id, date });

    if (!attendance) {
      const response = sendErrorResponse(
        STATUS_CODES.UNAUTHORIZED,
        null,
        EMPLOYEE_MESSAGES.ATTENDANCE_NOT_FOUND
      );
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }

    // Validate session index
    if (session_index < 0 || session_index >= attendance.sessions.length) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        EMPLOYEE_MESSAGES.INVALID_SESSION
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    // Update only provided fields
    if (check_in_time) {
      attendance.sessions[session_index].check_in_time = new Date(
        check_in_time
      );
    }
    if (check_out_time) {
      attendance.sessions[session_index].check_out_time = new Date(
        check_out_time
      );
    }

    // Ensure check-out time is after check-in time
    if (
      attendance.sessions[session_index].check_in_time &&
      attendance.sessions[session_index].check_out_time &&
      attendance.sessions[session_index].check_out_time <=
        attendance.sessions[session_index].check_in_time
    ) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        EMPLOYEE_MESSAGES.CHECK_IN_TIME_MUST_FIRST
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    // Recalculate total duration
    attendance.total_duration = attendance.sessions.reduce((sum, session) => {
      return sum + (session.check_out_time - session.check_in_time);
    }, 0);

    await attendance.save();

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      attendance,
      EMPLOYEE_MESSAGES.ATTENDANCE_UPDATED
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

export default {
  hrCheckIn,
  hrCheckOut,
  getHRAttendanceRecords,
  addEmployeeAttendance,
  editEmployeeAttendance,
};
