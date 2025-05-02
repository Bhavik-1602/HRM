import express from 'express'
import { getAllHolidays, getHolidayById } from "../../../controllers/hr/v1/index.js";
import verifyEmployee from "../../../middlewares/verifyEmployee.middleware.js";


const router = express.Router();
router.get("/all", verifyEmployee, getAllHolidays);
router.get("/:id", verifyEmployee,  getHolidayById);

export default router;