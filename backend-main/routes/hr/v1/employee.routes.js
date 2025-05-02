import express from 'express'
import { createEmployee, deleteEmployee, getAllEmployees, getEmployeeById, updateEmployee } from "../../../controllers/hr/v1/index.js";
import verifyHr from "../../../middlewares/verifyHr.middleware.js";
import validateRequest from '../../../middlewares/validateRequest.js';
import {updateEmployeeSchema, createEmployeeSchema} from '../../../config/validation/index.js'


const router = express.Router();
router.post("/create-employee", [verifyHr, validateRequest(createEmployeeSchema)],createEmployee);
router.get("/all", verifyHr, getAllEmployees);
router.get("/:id", verifyHr,  getEmployeeById);
router.put("/:id", [verifyHr, validateRequest(updateEmployeeSchema)],  updateEmployee);
router.delete("/:id", verifyHr, deleteEmployee);

export default router;