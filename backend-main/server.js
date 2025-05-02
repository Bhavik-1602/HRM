dotenv.config();
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRouter from "./routes/admin/index.js";
import hrRouter from "./routes/hr/index.js";
import employeeRouter from "./routes/employee/index.js";

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/admin", adminRouter);
app.use("/api/hr", hrRouter);
app.use("/api/employee", employeeRouter);


app.get("/", (req, res) => res.send("API Running")); // for testing

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
