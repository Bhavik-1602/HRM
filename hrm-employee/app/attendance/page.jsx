"use client";
import { useState, useEffect } from "react";
import { POST, PUT, GET } from "@/helper/api_helper";
import { CHECKIN_URL, CHECKOUT_URL, ATTENDANCE_URL } from "@/helper/url_helper";
import { TOKEN } from "@/config/constant";
import { toast } from "react-toastify";
import { useUser } from "@/stores/useUserStore";
import Loader from "@/components/common/Loader";

// fomate date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
};

// formate time
const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  return new Date(timeString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// find total time from duration
const formatTotalTime = (milliseconds) => {
  if (!milliseconds || isNaN(milliseconds)) return "N/A";

  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);

  return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
};

export default function AttendancePage() {
  const { user, setUser } = useUser();
  const [attendance, setAttendance] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  let userId = user?.userId;

  // fetch attendance records
  useEffect(() => {
    if (!userId) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
        userId = storedUser.userId;
      }
    }
    fetchAttendance();
  }, []);

 // check if user already check in
  useEffect(()=>{
    const checkIn=attendance[0]?.checkOutTime =="N/A";
    setIsCheckedIn(checkIn);
  },[attendance]);

// handle fatch attandance records
const fetchAttendance = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem(TOKEN);
    if (!token) {
      toast.error("Authentication token missing. Please log in again.");
      setLoading(false);
      return;
    }

    const response = await GET(ATTENDANCE_URL);
    if (response?.data) {
      setAttendance(
        response.data.map((entry) => ({
          date: formatDate(entry.date),
          day: new Date(entry.date).toLocaleDateString("en-US", { weekday: "long" }),
          checkInTime: entry.sessions?.[0]?.check_in_time ? formatTime(entry.sessions[0].check_in_time) : "N/A",
          checkOutTime:
            entry.sessions?.[entry.sessions.length - 1]?.check_out_time
              ? formatTime(entry.sessions[entry.sessions.length - 1].check_out_time)
              : "N/A",
          totalTime: formatTotalTime(entry.total_duration),
        }))
      );
    } else {
      toast.error(response?.meta?.message || "Failed to load attendance");
    }
  } catch (err) {
    const errorMessage = err.response.data.meta.message;
    toast.error(errorMessage);
  }
  setLoading(false);
};

// handle checkin and chckout
const handleCheckInOut = async () => {
  setIsLoading(true);

  const token = localStorage.getItem(TOKEN);
  if (!token) {
    toast.error("Authentication token missing. Please log in again.");
    setIsLoading(false);
    return;
  }

  if (!userId) {
    toast.error("User ID is missing. Please log in again.");
    setIsLoading(false);
    return;
  }

  try {
    const url = isCheckedIn ? CHECKOUT_URL : CHECKIN_URL;
    const method = isCheckedIn ? PUT : POST;
    const requestBody = { employee_id : userId };

    const response = await method(
      url,
      requestBody
    );

    if (response?.data) {
      toast.success(isCheckedIn ? "Checked Out Successfully!" : "Checked In Successfully!");

      fetchAttendance(userId);
    } else {
      toast.error(response?.meta?.message || (isCheckedIn ? "Check-out failed" : "Check-in failed"));
    }
    }
  catch (err) {
    setIsLoading(false);
    const errorMessage = err.response.data.meta.message;
    toast.error(errorMessage);
  }
  setIsLoading(false);
};

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-gray-500">Track your check-in and check-out times</p>
      </div>

      {/* check in - check out button */}
      <button
        className={`${
          isCheckedIn ? "bg-[#F37451] hover:bg-orange-600" : "bg-[#F37451] hover:bg-orange-600"
        } text-white px-6 py-2 rounded-md mb-4 transition-all disabled:bg-gray-400`}
        onClick={handleCheckInOut}
        disabled={isLoading}
      >
        {isLoading ? <Loader /> : isCheckedIn ? "Check Out" : "Check In"}
      </button>

      {/* attandance table */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <Loader /> 
        </div>
      ) : attendance.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No records found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#FFE1D8] text-gray-700 border-gray-300">
              <tr>
                <th className="px-6 py-3 text-center border-r border-gray-300">Date</th>
                <th className="px-6 py-3 text-center border-r border-gray-300">Day</th>
                <th className="px-6 py-3 text-center border-r border-gray-300">Check In Time</th>
                <th className="px-6 py-3 text-center border-r border-gray-300">Check Out Time</th>
                <th className="px-6 py-3 text-center border-r border-gray-300">Total Time</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-200 transition duration-200 border border-gray-300">
                  <td className="px-6 py-3 text-center border-r border-gray-300">{entry.date}</td>
                  <td className="px-6 py-3 text-center border-r border-gray-300">{entry.day}</td>
                  <td className="px-6 py-3 text-center border-r border-gray-300">{entry.checkInTime}</td>
                  <td className="px-6 py-3 text-center border-r border-gray-300">{entry.checkOutTime}</td>
                  <td className="px-6 py-3 text-center border-r border-gray-300">{entry.totalTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
