import moment from "moment";
import {
  LeaveModel,
  LeaveBalanceModel,
  EmployeeModel,
  EmployeeTypeModel,
  LeaveTypeModel,
} from "../../../../models/index.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../../../config/responseHandler.config.js";
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import validateRequest from "../../../../middlewares/validateRequest.js";
import { EMPLOYEE_MESSAGES } from "../../../../config/constants/responseMessage/employee/employee.message.js";

// Employee apply for leave
const applyLeave = async (req, res) => {
  try {
    const { start_date, end_date, leave_type, reason, halfday_type } = req.body;
    const { _id: employee_id } = req.user;

    // Handle file uploads
    const leave_doc = req.files ? req.files.map((file) => file.path) : [];

    // Validate request body
    const validation = validateRequest(req.body);
    if (validation.error) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json(
          sendErrorResponse(
            STATUS_CODES.BAD_REQUEST,
            null,
            validation.error.details[0].message
          )
        );
    }

    // Date validation
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (halfday_type && startDate.toDateString() !== endDate.toDateString()) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json(
          sendErrorResponse(
            STATUS_CODES.BAD_REQUEST,
            null,
            EMPLOYEE_MESSAGES.INVALID_HALF_DAY
          )
        );
    }

    if (startDate > endDate) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json(
          sendErrorResponse(
            STATUS_CODES.BAD_REQUEST,
            null,
            EMPLOYEE_MESSAGES.INVALID_DATE_RANGE
          )
        );
    }

    // Check for overlapping leave requests
    const overlappingLeave = await LeaveModel.findOne({
      employee_id,
      status: { $in: ["Pending", "Approved"] },
      $or: [
        {
          start_date: { $lte: endDate },
          end_date: { $gte: startDate },
        },
      ],
    });

    if (overlappingLeave) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json(
          sendErrorResponse(
            STATUS_CODES.BAD_REQUEST,
            null,
            EMPLOYEE_MESSAGES.OVERLAPPING_LEAVE(
              overlappingLeave.start_date.toISOString().split("T")[0],
              overlappingLeave.end_date.toISOString().split("T")[0]
            )
          )
        );
    }

    // Calculate requested days
    const requestedDays = halfday_type
      ? 0.5
      : Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    // Get employee details
    const employee = await EmployeeModel.findById(employee_id)
      .select("employee_type")
      .populate("employee_type");

    if (!employee || !employee.employee_type) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json(
          sendErrorResponse(
            STATUS_CODES.NOT_FOUND,
            null,
            EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND
          )
        );
    }

    // Fetch employee type with leave balance information
    const employeeType = await EmployeeTypeModel.findById(
      employee.employee_type
    ).populate("balance.leave_type");

    if (!employeeType) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json(
          sendErrorResponse(
            STATUS_CODES.NOT_FOUND,
            null,
            EMPLOYEE_MESSAGES.EMPLOYEE_TYPE_NOT_FOUND
          )
        );
    }

    // Find the leave type balance configuration for this employee type
    const leaveTypeBalance = employeeType.balance.find(
      (item) => item.leave_type && item.leave_type._id.toString() === leave_type.toString()
    );

    if (!leaveTypeBalance) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json(
          sendErrorResponse(
            STATUS_CODES.NOT_FOUND,
            null,
            EMPLOYEE_MESSAGES.LEAVE_TYPE_NOT_ASSIGNED
          )
        );
    }

    // Check leave balance
    const leaveBalance = await LeaveBalanceModel.findOne({
      employee_id: employee_id,
      leave_type: leave_type,
    });

    const availableLeaves =
      leaveTypeBalance.total_leaves - (leaveBalance?.used_leaves || 0);

    if (requestedDays > availableLeaves + 0.0001) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json(
          sendErrorResponse(
            STATUS_CODES.BAD_REQUEST,
            null,
            EMPLOYEE_MESSAGES.INSUFFICIENT_BALANCE(
              availableLeaves,
              requestedDays
            )
          )
        );
    }

    // Create leave request (status will be "Pending")
    const leaveRequest = await LeaveModel.create({
      employee_id,
      start_date: startDate,
      end_date: endDate,
      leave_type,
      halfday_type: halfday_type || null,
      reason,
      leave_doc,
      status: "Pending",
      requested_days: requestedDays,
    });

    return res
      .status(STATUS_CODES.SUCCESS)
      .json(
        sendSuccessResponse(
          STATUS_CODES.SUCCESS,
          { leaveRequest },
          EMPLOYEE_MESSAGES.LEAVE_SUBMITTED
        )
      );
  } catch (error) {
    console.error("Leave request error:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json(
        sendErrorResponse(
          STATUS_CODES.SERVER_ERROR,
          null,
          COMMON_MESSAGES.SERVER_ERROR
        )
      );
  }
};

// Employee edit or cancel leave request
const editLeaveRequest = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { start_date, end_date, leave_type, reason, leave_doc, cancel } =
      req.body;
    const { _id: employee_id } = req.user;

    const leave = await LeaveModel.findOne({ _id: leaveId, employee_id });

    if (!leave) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        EMPLOYEE_MESSAGES.LEAVE_REQUEST_NOT_FOUND
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    // Allow edit/cancel only if status is "Pending"
    if (leave.status !== "Pending") {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        EMPLOYEE_MESSAGES.LEAVE_EDIT_DENIED
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    if (cancel) {
      // Cancel leave request
      leave.status = "Cancelled";
      await leave.save();

      const response = sendSuccessResponse(
        STATUS_CODES.SUCCESS,
        leave,
        EMPLOYEE_MESSAGES.LEAVE_CANCELLED
      );
      return res.status(STATUS_CODES.SUCCESS).json(response);
    }

    // Edit leave request details
    leave.start_date = start_date || leave.start_date;
    leave.end_date = end_date || leave.end_date;
    leave.leave_type = leave_type || leave.leave_type;
    leave.reason = reason || leave.reason;
    leave.leave_doc = leave_doc || leave.leave_doc;

    await leave.save();

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      leave,
      EMPLOYEE_MESSAGES.LEAVE_UPDATED
    );
    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    console.error("Error editing leave request:", error.message);
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      EMPLOYEE_MESSAGES.LEAVE_UPDATE_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

// Get Employee Leave balance
const getEmployeeLeaveBalance = async (req, res) => {
  try {
    const employee_id = req.user.id;
    const leaveBalance = await LeaveBalanceModel.find({
      employee_id,
    }).populate("leave_type").lean();

    if (!leaveBalance) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        EMPLOYEE_MESSAGES.LEAVE_BALANCE_NOT_FOUND
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      leaveBalance,
      EMPLOYEE_MESSAGES.LEAVE_BALANCE_FETCHED
    );

    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    console.error("Error fetching leave balance:", error.message);
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      EMPLOYEE_MESSAGES.LEAVE_BALANCE_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

// Get Employee's Leave Records with Pagination
const getEmployeeLeaves = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      start_date,
      end_date,
      status,
      leave_type,
      month,
      year,
    } = req.query;

    // Get userId from query or authentication
    const userId = req.query.userId || req.user?.id;
    if (!userId) {
      const response = sendErrorResponse(
        STATUS_CODES.UNAUTHORIZED,
        null,
        COMMON_MESSAGES.UNAUTHORIZED
      );
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }

    // Convert pagination params
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    if (page <= 0 || limit <= 0) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        COMMON_MESSAGES.INVALID_PAGE_AND_LIMIT
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    let filter = { employee_id: userId };

    const parsedStartDate = start_date
      ? moment.utc(start_date, "YYYY-MM-DD", true).startOf("day").toDate()
      : null;
    const parsedEndDate = end_date
      ? moment.utc(end_date, "YYYY-MM-DD", true).endOf("day").toDate()
      : null;

    if (parsedStartDate && parsedEndDate) {
      filter["$and"] = [
        { start_date: { $gte: parsedStartDate } }, // Start date should be on or after `start_date`
        { end_date: { $lte: parsedEndDate } }, // End date should be on or before `end_date`
      ];
    } else if (parsedStartDate) {
      filter["start_date"] = { $gte: parsedStartDate };
    } else if (parsedEndDate) {
      filter["end_date"] = { $lte: parsedEndDate };
    }

    // Handle Month & Year Filters (Only Apply If start_date and end_date Are Not Provided)
    if (!parsedStartDate && !parsedEndDate) {
      if (month && year) {
        const startOfMonth = moment()
          .year(year)
          .month(month - 1)
          .startOf("month")
          .toDate();
        const endOfMonth = moment()
          .year(year)
          .month(month - 1)
          .endOf("month")
          .toDate();
        filter.start_date = { $gte: startOfMonth, $lte: endOfMonth };
      } else if (month) {
        const startOfMonth = moment()
          .month(month - 1)
          .startOf("month")
          .toDate();
        const endOfMonth = moment()
          .month(month - 1)
          .endOf("month")
          .toDate();
        filter.start_date = { $gte: startOfMonth, $lte: endOfMonth };
      } else if (year) {
        const startOfYear = moment().year(year).startOf("year").toDate();
        const endOfYear = moment().year(year).endOf("year").toDate();
        filter.start_date = { $gte: startOfYear, $lte: endOfYear };
      }
    }

    // Apply Default Filter for the Current Month if No Dates Are Provided
    if (!start_date && !end_date && !month && !year) {
      const startOfMonth = moment().utc().startOf("month").toDate();
      const endOfMonth = moment().utc().endOf("month").toDate();
      filter.start_date = { $gte: startOfMonth, $lte: endOfMonth };
    }

    // Handle Status Filter: Ensure Cancelled leaves are also included
    if (status) {
      filter.status = status;
    } else {
      filter.status = { $in: ["Pending", "Approved", "Rejected", "Cancelled"] }; // Include all by default
    }

    // Handle Leave Type (Convert name to _id)
    if (leave_type) {
      const leaveTypeDoc = await LeaveTypeModel.findOne({ name: leave_type });
      if (leaveTypeDoc) {
        filter.leave_type = leaveTypeDoc._id;
      } else {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            sendErrorResponse(
              STATUS_CODES.BAD_REQUEST,
              null,
              "Invalid leave type"
            )
          );
      }
    }

    // Pagination calculations
    const skip = (page - 1) * limit;
    const totalLeaves = await LeaveModel.countDocuments(filter);

    // Fetch leave records
    const leaves = await LeaveModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ start_date: -1 })
      .populate("leave_type")
      .select("start_date end_date leave_type status reason")
      .lean();

    // If no records found
    if (!leaves.length) {
      const response = sendSuccessResponse(
        STATUS_CODES.SUCCESS,
        {
          totalRecords: 0,
          totalPages: 0,
          currentPage: page,
          pageSize: limit,
          data: [],
        },
        COMMON_MESSAGES.NO_LEAVE_RECORD
      );
      return res.status(STATUS_CODES.SUCCESS).json(response);
    }

    // Send success response
    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      {
        totalRecords: totalLeaves,
        totalPages: Math.ceil(totalLeaves / limit),
        currentPage: page,
        pageSize: limit,
        data: leaves,
      },
      COMMON_MESSAGES.SUCCESS
    );

    return res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    console.error("Error fetching leaves:", error.message);
    const response = sendErrorResponse(
      STATUS_CODES.SERVER_ERROR,
      null,
      COMMON_MESSAGES.SERVER_ERROR
    );
    return res.status(STATUS_CODES.SERVER_ERROR).json(response);
  }
};

// Fetch all Available Leave Type
const getAllLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveTypeModel.find({}, "_id leave_type");

    let response;
    if (!leaveTypes.length) {
      response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        EMPLOYEE_MESSAGES.NO_LEAVE_TYPES
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      leaveTypes,
      EMPLOYEE_MESSAGES.LEAVE_TYPE_FETCHED
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
  applyLeave,
  editLeaveRequest,
  getEmployeeLeaveBalance,
  getEmployeeLeaves,
  getAllLeaveTypes,
};
