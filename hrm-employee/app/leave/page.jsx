import LeaveBalance from "@/components/leave/LeaveBalance";
import LeaveTable from "@/components/leave/LeaveTable";

export default function LeavePage() {
  return (
    <div>
      <div className="mb-2">
        <h1 className="text-2xl font-semibold">Leave</h1>
        <p className="text-gray-500">Take your Leave</p>
      </div>
      <div><LeaveBalance /></div>
      <div><LeaveTable /></div>
      
    </div>
  );
}
