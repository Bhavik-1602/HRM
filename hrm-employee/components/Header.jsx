"use client";
import logo from "../assets/header/headerlogo.png";
import { Grip } from "lucide-react";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Header = ({ toggleSidebar }) => {
  const [daysPassed, setDaysPassed] = useState(0);
  const [totalDays, setTotalDays] = useState(30);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const lastDay = new Date(currentYear, currentMonth, 0).getDate();
    setTotalDays(lastDay);
    setDaysPassed(today.getDate());
  }, []);

  const progress = Math.round((daysPassed / totalDays) * 100);

  return (
    <header className="flex items-center justify-between bg-[#F2F4F7] p-4 px-6">
      {/* Left - Logo */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="sm:hidden text-gray-700 focus:outline-none"
        >
          <Grip size={24} />
        </button>
        <Image src={logo} alt="Logo" width={80} height={80} />
      </div>

      {/* Right - Days Progress */}
      <div className="flex items-center gap-2">
        <span className="text-gray-600 text-sm">Days</span>
        <div className="relative w-10 h-10">
          <CircularProgressbar
            value={progress}
            strokeWidth={14} 
            styles={buildStyles({
              pathColor: "#F47B55",
              trailColor: "#eee",
              textColor: "transparent",
            })}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[12px] font-bold text-gray-800">
            {daysPassed}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
