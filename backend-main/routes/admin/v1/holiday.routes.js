import express from 'express'
import { createHoliday, getAllHolidays, updateHoliday, deleteHoliday, getHolidayById } from "../../../controllers/hr/v1/index.js";
import verifyAdmin from "../../../middlewares/verifyAdmin.middleware.js";
import validateRequest from '../../../middlewares/validateRequest.js';
import {createHolidayValidation, updateHolidayValidation} from '../../../config/validation/index.js'


const router = express.Router();
router.post("/create-holiday", [verifyAdmin, validateRequest(createHolidayValidation)],createHoliday);
router.get("/all", verifyAdmin, getAllHolidays);
router.get("/:id", verifyAdmin,  getHolidayById);
router.put("/:id", [verifyAdmin, validateRequest(updateHolidayValidation)],  updateHoliday);
router.delete("/:id", verifyAdmin, deleteHoliday);

export default router;