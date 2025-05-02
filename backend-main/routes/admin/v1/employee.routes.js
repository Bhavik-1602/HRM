import express from 'express'
import { createEmployee, deleteEmployee, getAllEmployees, getEmployeeById, updateEmployee } from "../../../controllers/hr/v1/index.js";
import verifyAdmin from "../../../middlewares/verifyAdmin.middleware.js";
import validateRequest from '../../../middlewares/validateRequest.js';
import {updateEmployeeSchema, createEmployeeSchema} from '../../../config/validation/index.js'


const router = express.Router();
router.post("/create-employee", [verifyAdmin, validateRequest(createEmployeeSchema)],createEmployee);
router.get("/all", verifyAdmin, getAllEmployees);
router.get("/:id", verifyAdmin,  getEmployeeById);
router.put("/:id", [verifyAdmin, validateRequest(updateEmployeeSchema)],  updateEmployee);
router.delete("/:id", verifyAdmin, deleteEmployee);

export default router;