import EmployeeTypeModel from "../../models/employeeType.model.js";
import LeaveTypeModel from "../../models/leavetype.model.js";

const employeeTypeData = [
  {
    employee_type: "Developer",
    leave_types: [] 
  },
  {
    employee_type: "Intern",
    leave_types: []
  },
  {
    employee_type: "Probation Period",
    leave_types: []
  }
];

export const seedEmployeeTypes = async () => {
  try {
    const leave_types = await LeaveTypeModel.find();

    if (!leave_types.length) {
      console.log("No leave types found. Please seed leave types first.");
      return;
    }

    const bulkOps = employeeTypeData.map((category) => ({
      updateOne: {
        filter: { employee_type: category.employee_type },
        update: {
          $set: {
            employee_type: category.employee_type,
            leave_types: leave_types.map((leave) => leave._id) 
          }
        },
        upsert: true 
      }
    }));

    await EmployeeTypeModel.bulkWrite(bulkOps);

    console.log("Employee Type seeded successfully.");
  } catch (error) {
    console.error("Error seeding Employee Type:", error.message);
  }
};
