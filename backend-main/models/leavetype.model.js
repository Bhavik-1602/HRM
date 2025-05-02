import mongoose from "mongoose";

const leaveTypeSchema = new mongoose.Schema(
  {
    leave_type: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  },
  { timestamps: true }
);

const LeaveTypeModel = mongoose.model("LeaveType", leaveTypeSchema);
export default LeaveTypeModel;