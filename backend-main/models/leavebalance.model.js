import mongoose from "mongoose";

const leaveBalanceSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    hr_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hr",
    },
    employee_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeType", // Correct reference
      required: true,
    },
    leave_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveType",
      required: true,
    },
    used_leaves: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const LeaveBalanceModel = mongoose.model("LeaveBalance", leaveBalanceSchema);
export default LeaveBalanceModel;