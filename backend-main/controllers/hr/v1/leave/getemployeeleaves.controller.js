import {LeaveModel, LeaveTypeModel } from '../../../../models/index.js'
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../../../config/responseHandler.config.js";
import moment from 'moment'
import { EMPLOYEE_MESSAGES } from "../../../../config/constants/responseMessage/employee/employee.message.js";

const getAllAppliedLeaves = async (req, res) => {
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

    let filter = {}; // No hr_id filter, fetch all employee leave records

    // Parse Date Filters
    const parsedStartDate = start_date
      ? moment.utc(start_date, "YYYY-MM-DD", true).startOf("day").toDate()
      : null;
    const parsedEndDate = end_date
      ? moment.utc(end_date, "YYYY-MM-DD", true).endOf("day").toDate()
      : null;

    if (parsedStartDate && parsedEndDate) {
      filter["$and"] = [
        { start_date: { $gte: parsedStartDate } },
        { end_date: { $lte: parsedEndDate } },
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

    // Default to current month & year if no filters are passed
    if (!start_date && !end_date && !month && !year) {
      const startOfMonth = moment().utc().startOf("month").toDate();
      const endOfMonth = moment().utc().endOf("month").toDate();
      filter.start_date = { $gte: startOfMonth, $lte: endOfMonth };
    }

    // Handle Status Filter
    if (status) {
      filter.status = status;
    } else {
      filter.status = { $in: ["Pending", "Approved", "Rejected", "Cancelled"] };
    }

    // Handle Leave Type
    if (leave_type) {
      const leaveTypeDoc = await LeaveTypeModel.findOne({ name: leave_type });
      if (leaveTypeDoc) {
        filter.leave_type = leaveTypeDoc._id;
      } else {
        const response = sendErrorResponse(
          STATUS_CODES.BAD_REQUEST,
          null,
          EMPLOYEE_MESSAGES.INVALID_LEAVE_TYPE
        );
        return res.status(STATUS_CODES.BAD_REQUEST).json(response);
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
      .populate("leave_type", "name") // Fetch only the leave type name
      .populate("employee_id", "first_name") // Fetch only first_name of employee
      .select("start_date end_date leave_type status reason employee_id")
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
        const response = sendErrorResponse(STATUS_CODES.SERVER_ERROR, null, COMMON_MESSAGES.SERVER_ERROR);
        return res.status(STATUS_CODES.SERVER_ERROR).json(response);
      }  
    };

export default { getAllAppliedLeaves };
