"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { useState, useEffect } from "react";
import { TOKEN } from "@/config/constant";
import { useUser } from "@/stores/useUserStore";
import Image from 'next/image';

const SideMenu = ({ isMobileOpen, setIsMobileOpen }) => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobileOpen]);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem("user-storage");
    router.push("/login");
  };

  // Get first name with first letter capitalized
  const getFormattedName = (name) => {
    if (!name) return "User";
    const firstName = name.split(" ")[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };

  return (
    <div
      className={`bg-white m-2 mt-0 shadow-lg flex flex-col rounded-2xl z-50 transition-all sm:relative 
      ${isMobileOpen ? "w-64 fixed sm:relative h-120" : "w-0 sm:w-64 sm:relative fixed hidden md:flex"} 
      ${!isMobileOpen && (isOpen ? "md:w-64" : "md:w-20")}`}
    >
      {/* User Profile Section */}
      <div className="p-2 m-2 flex items-center gap-3 bg-[#F2F4F7] rounded-lg">
        {user?.profile_image != "" ? (
          <img src={user?.profile_image} alt="Profile" className="h-10 w-10 object-cover rounded-full" />
        ) : (
          <Image
            src="/assets/Default-DP.png"
            alt="Profile"
            width={22}
            height={22}
            className="object-cover"
          />
        )}
        {(isOpen || isMobileOpen) && (
          <div>
            <h2 className="text-sm font-semibold">{getFormattedName(user?.name)}</h2>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute z-50 -right-2 top-1/15 transform -translate-y-1/2 bg-white text-black p-1 rounded-full shadow-lg hidden md:block"
        >
          {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className={`flex items-center gap-3 p-2 rounded-lg text-[#F37451] transition ${pathname === "/" ? "bg-[#FFE1D8] font-semibold" : ""
                }`}
            >
              <LayoutDashboard size={24} className="text-orange-500" />
              {(isOpen || isMobileOpen) && "Dashboard"}
            </Link>
          </li>
          <li>
            <Link
              href="/attendance"
              className={`flex items-center gap-3 p-2 rounded-lg text-[#F37451] transition ${pathname === "/attendance" ? "bg-[#FFE1D8] font-semibold" : ""
                }`}
            >
              <CalendarCheck size={24} className="text-orange-500" />
              {(isOpen || isMobileOpen) && "Attendance"}
            </Link>
          </li>
          <li>
            <Link
              href="/leave"
              className={`flex items-center gap-3 p-2 rounded-lg text-[#F37451] transition ${pathname === "/leave" ? "bg-[#FFE1D8] font-semibold" : ""
                }`}
            >
              <CalendarDays size={24} className="text-orange-500" />
              {(isOpen || isMobileOpen) && "Leave"}
            </Link>
          </li>
          <li>
            <Link
              href="/account"
              className={`flex items-center gap-3 p-2 rounded-lg text-[#F37451] transition ${pathname === "/account" ? "bg-[#FFE1D8] font-semibold" : ""
                }`}
            >
              <User size={24} className="text-orange-500" />
              {(isOpen || isMobileOpen) && "My Account"}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Settings */}
      <div className="p-4 space-y-2">
        <Link
          href="/settings"
          className={`flex items-center gap-3 p-2 bg-[#F2F4F7] rounded-lg transition ${pathname === "/settings" ? "text-[#F37451]" : "text-gray-500"
            }`}
        >
          <Settings size={24} className="text-gray-500" />
          {(isOpen || isMobileOpen) && "Settings"}
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 p-2 bg-[#F2F4F7] rounded-lg text-gray-500 transition hover:text-[#F37451]"
        >
          <LogOut size={24} className="text-gray-500" />
          {(isOpen || isMobileOpen) && "Log Out"}
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
