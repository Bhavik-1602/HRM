import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema(
  {
    first_name: { type: String, trim: true },
    last_name: { type: String, trim: true },
    work_email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    phone_number: {
          type: String,
          match: /^\d{10}$/,
        },
        dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other", ""] },
    password: { type: String, required: true, minlength: 8 },
    position_in_the_company:{ type: String, enum: ["CEO", "CTO", "OWNER", ""]},
    reset_password_token: {
      type: String,
      default: null,
    },
    reset_password_expires: {
      type: Date,
      default: null,
    },
    profile_image: { type: String, default: "" },
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
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", ""],
    },
    emergency_contact: {
      name: { type: String },
      relationship: { type: String },
      phone: { type: String, match: /^\d{10}$/ },
    },
    education_details: {
      degree: { type: String },
      university_name: { type: String },
      college_name: { type: String },
      passing_year: { type: String },
    },
  },
  { timestamps: true }
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const AdminModel = mongoose.model("Admin", adminSchema);
export default AdminModel;
