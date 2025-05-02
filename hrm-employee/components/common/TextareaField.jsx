import { useState } from "react";

const TextareaField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  error, 
  className = "" 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      {/* Floating Placeholder */}
      <label
        className={`absolute left-3 transition-all pointer-events-none ${
          isFocused || value
            ? "top-[-10px] left-2 text-sm md:text-xs text-[#F47B55] bg-white px-1"
            : "top-4 md:top-3 text-base md:text-sm text-gray-500"
        }`}
      >
        {placeholder || label}*
      </label>

      {/* Textarea Field */}
      <textarea
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(value !== "")}
        className={`w-full h-[100px] px-3 pt-5 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47B55] resize-none ${className}`}
      />

      {/* Error Message */}
      {error && <p className="mt-1 text-sm md:text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default TextareaField;
