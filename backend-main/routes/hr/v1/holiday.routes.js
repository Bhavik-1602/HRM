import express from 'express'
import { createHoliday, getAllHolidays, updateHoliday, deleteHoliday, getHolidayById } from "../../../controllers/hr/v1/index.js";
import verifyHr from "../../../middlewares/verifyHr.middleware.js";
import validateRequest from '../../../middlewares/validateRequest.js';
import {createHolidayValidation, updateHolidayValidation} from '../../../config/validation/index.js'


const router = express.Router();
router.post("/create-holiday", [verifyHr, validateRequest(createHolidayValidation)],createHoliday);
router.get("/all", verifyHr, getAllHolidays);
router.get("/:id", verifyHr,  getHolidayById);
router.put("/:id", [verifyHr, validateRequest(updateHolidayValidation)],  updateHoliday);
router.delete("/:id", verifyHr, deleteHoliday);

export default router;