"use client";

import React, { useEffect, useState } from "react";
import { GET } from "@/helper/api_helper";
import { LEAVE_BALANCE_URL } from "@/helper/url_helper";
import { TOKEN } from "@/config/constant";
import Loader from "@/components/common/Loader"; 

const LeaveBalance = () => {
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
      fetchLeaveBalance();
    }, [])


  const fetchLeaveBalance = async () => {
    const token = localStorage.getItem(TOKEN);
    if (!token) return;

    try {
      const response = await GET(LEAVE_BALANCE_URL);
      
      setLeaveBalance(response.data);
    } catch (err) {
      setError("Failed to load leave balance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFE1D8] p-4 rounded-lg w-full">
      <h2 className="text-xl font-bold">Used Leave Balance</h2>

      {loading ? (
        <div className="flex justify-center mt-4">
          <Loader /> 
        </div>
      ) : error ? (
        <p className="text-red-500 text-center mt-4">{error}</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
          {Array.isArray(leaveBalance) && leaveBalance.length > 0 ? (
            leaveBalance.filter(leave => leave.leave_type !== null).map((leave, index) => (
              <div
                key={index}
                className="bg-white p-2 rounded-md shadow text-center min-w-[100px]"
              >
                <p className="text-gray-500 text-sm">{leave?.leave_type?.leave_type} Leave</p>
                <p className="text-lg font-semibold text-blue-600">
                  {leave.used_leaves}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No leave balance available.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaveBalance;
