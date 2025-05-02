import { useState } from "react";

const InputField = ({ name, label, type = "text", value, onChange, onBlur, disabled, placeholder, error, className = "" }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      {/* Floating Label */}
      <label
        className={`absolute left-3 transition-all pointer-events-none ${
          isFocused || value
            ? "top-[-10px] left-2 text-sm md:text-xs text-[#F47B55] bg-white px-1"
            : "top-4 md:top-3 text-base md:text-sm text-gray-500"
        }`}
      >
        {placeholder || label}
      </label>

      {/* Input Field */}
      <input
        name={name}
        type={isFocused ? type : "text"}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(value !== "");  
          if (onBlur) {
            onBlur(e);
          }
        }}
        disabled={disabled ? true : false}
        className={`w-full h-[52px] md:h-[45px] px-3 pt-5 pb-5 border ${disabled ? "cursor-not-allowed" : "cursor-default"} ${error ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47B55] ${className}`}
      />

      {/* Error Message */}
      {error && <p className="mt-1 text-sm md:text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
