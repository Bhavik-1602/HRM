import React from "react";
import { Mail } from "lucide-react"; // Import email icon from lucide-react

const Footer = () => {
  return (
    <footer className="bg-white shadow-md p-2 text-sm text-gray-600 flex flex-col sm:flex-row justify-between items-center px-6 text-center sm:text-left">
      {/* Left Section - Copyright Info */}
      <div className="flex flex-col sm:block">
        <span>
          Copyright ©2018 - 2025 -{" "}
          <a href="#" className="text-orange-500 font-semibold">
            tecoreng
          </a>
          .
        </span>
        <span className="sm:ml-1">All rights reserved.</span>
      </div>

      {/* Right Section - Email */}
      <div className="flex items-center gap-2 ">
        <Mail className="text-gray-500 w-4 h-4" />
        <a href="mailto:support@tecoreng.com" className="text-gray-600">
          support@tecoreng.com
        </a>
      </div>
    </footer>
  );
};

export default Footer;
