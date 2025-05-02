import {
  EmployeeModel,
  EmployeeTypeModel,
  LeaveBalanceModel,
} from "../../../../models/index.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../../../config/responseHandler.config.js";
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import { EMPLOYEE_MESSAGES } from "../../../../config/constants/responseMessage/employee/employee.message.js";
import { isValidObjectId, formatDate } from "../../../../utils/commonUtils.js";

const createEmployee = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      work_email,
      password,
      confirm_password,
      employee_type,
      employee_code,
      joining_date,
      job_title
    } = req.body;

    if (
      !first_name?.trim() ||
      !last_name?.trim() ||
      !work_email?.trim() ||
      !password ||
      !confirm_password ||
      !employee_type?.trim() ||
      !employee_code?.trim() ||
      !joining_date ||
      !job_title?.trim()
    ) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        COMMON_MESSAGES.INVALID_INPUT
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    // Check if passwords match
    if (password !== confirm_password) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        EMPLOYEE_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    // Check if employee already exists
    const existingUser = await EmployeeModel.findOne({ work_email });
    if (existingUser) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        COMMON_MESSAGES.EMAIL_ALREADY_EXIST
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    // Check if employee_code already exists
    const existingEmployee = await EmployeeModel.findOne({
      employee_code: employee_code.trim(),
    });
    if (existingEmployee) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        EMPLOYEE_MESSAGES.UNIQUE_EMPLOYEE_CODE
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    // Convert "DD-MM-YYYY" to "YYYY-MM-DD" before parsing
    const [day, month, year] = joining_date.split("-");
    const formattedJoiningDate = `${year}-${month}-${day}`;
    let parsedJoiningDate = new Date(formattedJoiningDate);

    if (isNaN(parsedJoiningDate)) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        EMPLOYEE_MESSAGES.INVALID_JOINING_DATE_FORMAT
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    // Create and save employee with only validated fields
    const newEmployee = await EmployeeModel.create({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      work_email: work_email.trim().toLowerCase(),
      password,
      employee_type: employee_type.trim(),
      employee_code: employee_code.trim(),
      joining_date: parsedJoiningDate,
      job_title: job_title.trim(),
    });

    // Fetch all leave types based on employee_type from EmployeeTypemodel
    const leaveTypes = await EmployeeTypeModel.findById({ _id: employee_type });

    if (!leaveTypes) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        EMPLOYEE_MESSAGES.LEAVE_TYPE_NOT_FOUND
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    // Insert leave balance records for the new employee
    const leaveBalances = leaveTypes.balance.map((leave) => ({
      employee_id: newEmployee._id,
      employee_type: newEmployee.employee_type,
      leave_type: leave.leave_type,
      used_leaves: 0,
    }));

    await LeaveBalanceModel.insertMany(leaveBalances);

    const response = sendSuccessResponse(
      STATUS_CODES.CREATED,
      newEmployee,
      EMPLOYEE_MESSAGES.CREATED
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

// Get Employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await EmployeeModel.findOne({
      _id: id,
      is_deleted: false,
    }).populate({
      path: "employee_type",
      select: "employee_type", // Only include `employee_type` and `_id`
    });

    if (!employee) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      employee,
      EMPLOYEE_MESSAGES.RETRIEVED
    );
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      COMMON_MESSAGES.SERVER_ERROR
    );

    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

// Get All Employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await EmployeeModel.find({ is_deleted: false });

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      employees,
      EMPLOYEE_MESSAGES.RETRIEVED
    );
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      COMMON_MESSAGES.SERVER_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

// Update Employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      password,
      job_title,
      employee_type,
      last_working_day_date,
      status,
      employee_code,
    } = req.body;

    const employee = await EmployeeModel.findById(id);
    if (!employee || employee.is_deleted) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    // Update only password and jobTitle
    if (password) {
      try {
        employee.password = password;
      } catch (hashError) {
        console.error("Error hashing password:", hashError);
        return res.status(STATUS_CODES.SERVER_ERROR).json({
          error: "Error updating password",
        });
      }
    }

    if (job_title && job_title.trim()) {
      employee.job_title = job_title;
    }

    if (employee_type) {
      if (!isValidObjectId(employee_type)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            sendErrorResponse(
              STATUS_CODES.BAD_REQUEST,
              null,
              EMPLOYEE_MESSAGES.INVALID_EMPLOYEE_TYPE_ID
            )
          );
      }
      employee.employee_type = employee_type;
    }

    //  Handle last_working_day_date with correct format conversion
    if (last_working_day_date) {
      const formattedDate = formatDate(last_working_day_date);
      const parsedDate = new Date(formattedDate);

      if (isNaN(parsedDate)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            sendErrorResponse(
              STATUS_CODES.BAD_REQUEST,
              null,
              EMPLOYEE_MESSAGES.INVALID_LAST_WORKING_DATE_FORMAT
            )
          );
      }

      employee.last_working_day_date = parsedDate.toISOString();
      employee.status = "disabled"; // Automatically disable if last date is set
    }

    //  Allow HR to manually update status even if `last_working_day_date` is missing
    if (status !== undefined) {
      employee.status = status === "enabled"; // Convert to Boolean
    }

    // Update employee_code (Ensure it's unique)
    if (employee_code && employee_code.trim()) {
      const existingEmployee = await EmployeeModel.findOne({
        employee_code: employee_code,
        _id: { $ne: id }, // Ensure no duplication
      });

      if (existingEmployee) {
        return res.status(STATUS_CODES.BAD_REQUEST).json(
          sendErrorResponse(
            STATUS_CODES.BAD_REQUEST,
            null,
            EMPLOYEE_MESSAGES.EMPLOYEE_CODE_ALREADY_EXISTS
          )
        );
      }

      employee.employee_code = employee_code;
    }

    await employee.save();

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      employee,
      EMPLOYEE_MESSAGES.UPDATED
    );
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      COMMON_MESSAGES.SERVER_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

// Delete Employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await EmployeeModel.findById(id);

    if (!employee) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    // Perform Soft Delete
    employee.is_deleted = true;
    await employee.save();

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      employee,
      EMPLOYEE_MESSAGES.DELETED
    );
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      COMMON_MESSAGES.SERVER_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

export default {
  createEmployee,
  getEmployeeById,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
};
