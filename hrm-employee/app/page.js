"use client";

import { useUser } from "@/stores/useUserStore";

export default function Home() {
  const { user } = useUser(); 
  const firstName = user?.name; 

  // Get first name with first letter capitalized
  const getFormattedName = (name) => {
    if (!name) return "User";
    const firstName = name.split(" ")[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(); 
  }

  return (
    <div className="p-1">
      {/* Greeting Section */}
      <div className="bg-gradient-to-r from-[#FFE1D8] via-[#FFC4B4] to-[#FFE1D8] p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Hi, {getFormattedName(firstName)}</h1>
        <p className="text-gray-600">Welcome to Tecoreng.</p>
      </div>
    </div>
  );
}
