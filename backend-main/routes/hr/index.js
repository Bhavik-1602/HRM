import express from "express";
import hrRouter from "./v1/v1.js";

const router = express.Router();

router.use("/v1", hrRouter);

export default router;