import LeaveTypeModel from "../../models/leavetype.model.js";

const leaveTypeData = [
  { leave_type: "Paid" },
  { leave_type: "Casual" },
  { leave_type: "Unpaid" },
];

export const seedLeaveTypes = async () => {
  try {
    const bulkOps = leaveTypeData.map((leaveType) => ({
      updateOne: {
        filter: { leave_type: leaveType.leave_type },
        update: { $set: leaveType },
        upsert: true, // Prevents duplicates and updates existing leave types
      },
    }));

    await LeaveTypeModel.bulkWrite(bulkOps);

    console.log("Leave types seeded successfully.");
  } catch (error) {
    console.error("Error seeding leave types:", error.message);
  }
};
