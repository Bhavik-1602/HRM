import { HolidayModel } from "../../../../models/index.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../../../config/responseHandler.config.js";
import { STATUS_CODES } from "../../../../config/constants/httpStatusCodes.js";
import { COMMON_MESSAGES } from "../../../../config/constants/responseMessage/common.message.js";
import { HR_MESSAGES } from "../../../../config/constants/responseMessage/hr/hr.message.js";

/** Add a New Holiday */
const createHoliday = async (req, res) => {
  try {
    const { name, date } = req.body;

    // Check if holiday already exists
    const existingHoliday = await HolidayModel.findOne({ date });
    if (existingHoliday) {
      const response = sendErrorResponse(
        STATUS_CODES.BAD_REQUEST,
        null,
        HR_MESSAGES.HOLIDAY_ALREADY_EXISTS
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    const newHoliday = new HolidayModel({ name, date });
    await newHoliday.save();

    const response = sendSuccessResponse(
      STATUS_CODES.CREATED,
      newHoliday,
      HR_MESSAGES.HOLIDAY_CREATED
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

/** Get All Holidays */
const getAllHolidays = async (req, res) => {
  try {
    const holidays = await HolidayModel.find().sort({ date: 1 });

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      holidays,
      HR_MESSAGES.HOLIDAYS_RETRIEVED
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

/** Get Holiday by ID */
const getHolidayById = async (req, res) => {
  try {
    const { id } = req.params;

    const holiday = await HolidayModel.findById(id);
    if (!holiday) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        HR_MESSAGES.HOLIDAY_NOT_FOUND
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    // Convert UTC date to YYYY-MM-DD format before sending response
    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      holiday,
      HR_MESSAGES.HOLIDAY_FOUND
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

/** Update Holiday */
const updateHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date } = req.body;

    const updatedHoliday = await HolidayModel.findByIdAndUpdate(
      id,
      { name, date },
      { new: true }
    );
    if (!updatedHoliday) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        HR_MESSAGES.HOLIDAY_NOT_FOUND
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      updatedHoliday,
      HR_MESSAGES.HOLIDAY_UPDATED
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

/** Delete Holiday */
const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteHoliday = await HolidayModel.findByIdAndDelete(id);
    if (!deleteHoliday) {
      const response = sendErrorResponse(
        STATUS_CODES.NOT_FOUND,
        null,
        HR_MESSAGES.HOLIDAY_NOT_FOUND
      );
      return res.status(STATUS_CODES.NOT_FOUND).json(response);
    }

    const response = sendSuccessResponse(
      STATUS_CODES.SUCCESS,
      deleteHoliday,
      HR_MESSAGES.HOLIDAY_DELETED
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
  createHoliday,
  getAllHolidays,
  getHolidayById,
  updateHoliday,
  deleteHoliday,
};
