import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null },
    hr_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hr", default: null },
    date: { type: Date, required: true },
    sessions: [
      {
        check_in_time: { type: Date }, 
        check_out_time: { type: Date }, 
        duration: { type: Number, default: 0 },
      }
    ],
    total_duration: { type: Number, default: 0 } 
  },
  { timestamps: true }
);

attendanceSchema.pre("save", function (next) {
  this.total_duration = 0;

  this.sessions.forEach((session) => {
    if (session.check_in_time && session.check_out_time) {
      session.duration = session.check_out_time - session.check_in_time; 
      this.total_duration += session.duration; 
    }
  });

  next();
});


const AttendanceModel = mongoose.model("Attendance", attendanceSchema);
export default AttendanceModel;
