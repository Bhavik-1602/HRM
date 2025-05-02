import express from 'express'
import { createHr, getHrById, getAllHrs, updateHr, deleteHr } from "../../../controllers/admin/v1/index.js";
import verifyAdmin from "../../../middlewares/verifyAdmin.middleware.js";
import validateRequest from '../../../middlewares/validateRequest.js';
import {updateEmployeeSchema, createEmployeeSchema} from '../../../config/validation/index.js'


const router = express.Router();
router.post("/create-hr", [verifyAdmin, validateRequest(createEmployeeSchema)],createHr);
router.get("/all", verifyAdmin, getAllHrs);
router.get("/:id", verifyAdmin,  getHrById);
router.put("/:id", [verifyAdmin, validateRequest(updateEmployeeSchema)],  updateHr);
router.delete("/:id", verifyAdmin, deleteHr);

export default router;