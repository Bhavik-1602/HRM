import mongoose from "mongoose";
import bcrypt from "bcrypt";

const employeeSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    work_email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    personal_email: {
      type: String,
      lowercase: true,
      trim: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    personal_phone_number: {
      type: String,
      match: /^\d{10}$/,
    },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other", "not specified"], default: "not specified" },
    marital_status: { type: String, enum: ["married", "single", "other", "not specified"], default: "not specified" },
    profile_image: { type: String, default: "" },
    password: { type: String, required: true, minlength: 8 },
    reset_password_token: {
      type: String,
      default: null,
    },
    reset_password_expires: {
      type: Date,
      default: null,
    },
    job_title: { type: String, required: true },
    employee_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeType",
      required: true,
    },
    department: { type: String },
    joining_date: { type: Date, default: Date.now },
    last_working_day_date: { type: Date, default: null },
    reports_to: { type: String },
    permanent_address: {
      street1: { type: String },
      street2: { type: String },
      city: { type: String },
      state: { type: String },
      postal_code: { type: String, match: /^\d{5,6}$/ },
      country: {
        type: String,
        enum: ["India", "USA", "Canada", "UK", "Australia", ""],
      },
    },
    temporary_address: {
      street1: { type: String },
      street2: { type: String },
      city: { type: String },
      state: { type: String },
      postal_code: { type: String, match: /^\d{5,6}$/ },
      country: {
        type: String,
        enum: ["India", "USA", "Canada", "UK", "Australia", ""],
      },
    },

    employee_code: { type: String, unique: true, required: true },
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "not specified"],
      default: "not specified"
    },
    education_details: {
      degree: { type: String },
      university_name: { type: String },
      college_name: { type: String },
      passing_year: { type: String },
    },

    original_doc_submitted: { type: Boolean, default: "false" },
    original_doc_name: { type: String, default: "" },

    proof_doc: [{ type: String }],
    proof_doc_name: {type: String, default: ""},

    emergency_contact: {
      name: { type: String },
      relationship: { type: String },
      phone: { type: String, match: /^\d{10}$/ },
    },
    status: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const EmployeeModel = mongoose.model("Employee", employeeSchema);
export default EmployeeModel;
