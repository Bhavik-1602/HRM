import mongoose from "mongoose";
import dotenv from "dotenv";
import { seedLeaveTypes } from "./leaveType.seeder.js";
import { seedEmployeeTypes } from "./employeeType.seeder.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database connected successfully.");

    // Run all seeders here
    await seedLeaveTypes();
    await seedEmployeeTypes()

    console.log("All seeders executed successfully.");
    process.exit();
  } catch (error) {
    console.error("Error while seeding:", error.message);
    process.exit(1);
  }
};

seedDatabase();
