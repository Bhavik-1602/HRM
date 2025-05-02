import express from "express";
const router = express.Router();
import adminRouter from "./v1/v1.js";

router.use("/v1", adminRouter);

export default router;