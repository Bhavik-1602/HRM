"use client";
import { Loader2 } from "lucide-react";

const Button = ({ label, onClick, disabled=false, className = "", loading=false, btnType = "button" }) => {
  const baseStyles = "flex w-full h-[48px] items-center justify-center py-[12px] px-[20px] rounded-[8px] font-medium disabled:hover:cursor-not-allowed hover:cursor-pointer transition duration-200";
  
  const variantStyles = {
    submit: "bg-[#F47B55] text-white hover:bg-[#e66942] disabled:bg-[#f4b19a]",
    button: "bg-[#F47B55] opacity-90 text-white hover:bg-[#e66942] disabled:bg-[#f4b19a]",
    cancel: "border border-[#F47B55] text-[#F47B55] hover:text-white hover:bg-[#F47B55] disabled:bg-white disabled:border-[#f4b19a] disabled:text-[#f4b19a]"
  };
  
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[btnType]} ${className}`.trim()}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {label}
    </button>
  );
};

export default Button;
