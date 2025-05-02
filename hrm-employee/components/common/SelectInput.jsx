import { useState, useRef, useEffect } from "react";

const SelectInput = ({
  label,
  options = [],
  value,
  onChange,
  placeholder,
  error,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Floating Placeholder */}
      <label
        className={`absolute left-3 transition-all pointer-events-none bg-white px-1 ${isOpen || value
            ? "top-[-10px] left-2 text-sm md:text-xs text-[#F47B55]"
            : "top-4 md:top-3 text-base md:text-sm text-gray-500 w-[70%]"
          }`}
      >
        {placeholder || label}
      </label>

      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-[52px] md:h-[45px] px-3 flex items-center justify-between border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F47B55] ${error ? "border-red-500" : "border-gray-300"
          } ${className}`}
      >
        <span className={`${!value ? "text-gray-400" : ""}`}>
          {selectedOption?.label || placeholder}
        </span>

        {/* Arrow Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 text-black transition-transform ${isOpen ? "rotate-180" : ""
            }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-20 mt-1 w-full max-h-[150px] overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-md">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange({ target: { value: option.value } });
                setIsOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${option.value === value ? "bg-gray-100 font-medium" : ""
                }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm md:text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default SelectInput;
