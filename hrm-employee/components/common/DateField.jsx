import { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputField from "./InputField";

const DateInput = ({ label, selected, onChange, placeholder, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Convert stored UTC date string to a Date object in UTC
  const parseUTCDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  };

  // Convert selected date to UTC before storing 
  const handleDateChange = (date) => {
    if (!date) {
      onChange(null);
      return;
    }
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    onChange(utcDate.toISOString()); // Store in UTC format
  };

  // Custom Input for DatePicker
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div onClick={onClick} ref={ref} className="w-full">
      <InputField
        label={label}
        value={value}
        placeholder={placeholder}
        onChange={() => {}}
        className="w-full px-3 pt-5 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47B55]"
        error={error}
      />
    </div>
  ));

  return (
    <div className="w-full">
      <DatePicker
        selected={parseUTCDate(selected)} // Ensure displayed date is in UTC
        onChange={handleDateChange} // Store selected date in UTC
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        customInput={<CustomInput />}
        onCalendarOpen={() => setIsFocused(true)}
        onCalendarClose={() => setIsFocused(selected !== null)}
        className="w-full"
      />
    </div>
  );
};

export default DateInput;
