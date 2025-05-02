import express from "express";
import employeeRouter from "./v1/v1.js";

const router = express.Router();

router.use("/v1", employeeRouter);

export default router;
