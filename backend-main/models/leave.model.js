import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
    },
    hr_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hr",
      index: true,
    },
    start_date: { type: Date, required: true, index: true },
    end_date: { type: Date, required: true, index: true },
    leave_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveType",
      required: true,
    },
    halfday_type: {
      type: String,
      enum: ["First","Second"],
      default: null 
    },
    /* 
      Pending - leave is still not approved by HR
      Approved - leave is approved by HR
      Rejected - leave is declined by HR
      Cancelled - leave is cancelled by employee
    */
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
    },
    reason: { type: String, required: true },
    leave_doc: { type: [] },
  },
  { timestamps: true }
);

// Validation: Ensure `end_date` is not before `start_date`
LeaveSchema.pre("save", function (next) {
  if (this.end_date < this.start_date) {
    const err = new Error("End date cannot be before start date.");
    return next(err);
  }
  next();
});

const LeaveModel = mongoose.model('Leave', LeaveSchema);
export default LeaveModel;
