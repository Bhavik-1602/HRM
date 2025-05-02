import mongoose from "mongoose";

const employeeTypeSchema = new mongoose.Schema({
  employee_type: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  balance: [
    {
      leave_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LeaveType",
        required: true,
      },
      total_leaves: {
        type: Number,
        default: 0
      }
    }
  ],
}, { timestamps: true });

const EmployeeTypeModel = mongoose.model("EmployeeType", employeeTypeSchema);
export default EmployeeTypeModel;
