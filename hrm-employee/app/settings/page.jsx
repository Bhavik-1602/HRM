"use client";
import { useState, useEffect } from "react";
import InputField from "@/components/common/InputField";
import Button from "@/components/common/Button";
import { Eye, EyeOff } from "lucide-react";
import { POST } from "@/helper/api_helper";
import { CHANGE_PASSWORD_URL } from "@/helper/url_helper";
import { toast } from "react-toastify";
import { ChevronDown } from "lucide-react";

export default function Settings() {

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    form: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLgScreen, setIsLgScreen] = useState(false);
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Old password change
  const handleOldPasswordChange = (e) => {
    const oldPass = e.target.value;
    setOldPassword(oldPass);
  };

  useEffect(() => {
    const handleResize = () => setIsLgScreen(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle New password change
  const handleNewPasswordChange = (e) => {
    const newPass = e.target.value;
    setNewPassword(newPass);

    // Validate password length
    if (newPass.length > 0 && newPass.length < 8) {
      setError((prev) => ({
        ...prev,
        newPassword: "Password must be at least 8 characters",
      }));
    } else {
      setError((prev) => ({ ...prev, newPassword: "" }));
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    const newPass = e.target.value;
    setconfirmPassword(newPass);

    // check Confirm password with New Password
    if (newPass != newPassword) {
      setError((prev) => ({
        ...prev,
        confirmPassword: "Confirm Password must be same as new password.",
      }));
    } else {
      setError((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  // handle change password
  const handleChangePassword = async () => {
    try {
      const response = await POST(CHANGE_PASSWORD_URL, { old_password: oldPassword, new_password: newPassword });
      const status = response.meta.status;
      if (status == 200) {
        const message = response.meta.message;
        toast.success(message);
        setIsLoading(false);
      }

    } catch (e) {
      const errorMessage = e.response.data.meta.message;
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

// toggle visibility of passwords  
  const toggleOldPasswordVisibility = () => {
    setOldPasswordVisible((prevState) => !prevState);
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prevState) => !prevState);
  };


  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="md:flex items-center justify-center mt-3">
        <div className="w-full p-6 mt-6 items-center justify-center bg-white rounded-lg shadow-lg">
          {isLgScreen && (
            <h2 className="text-xl font-bold">Change Password</h2>
          )}
          {!isLgScreen && (
            <div
              className="flex justify-between items-center p-4 shadow-md cursor-pointer rounded-lg bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              <h2 className="text-xl font-bold">Change Password</h2>
              <ChevronDown
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </div>
          )}
          <div
            className={`lg:flex gap-2 overflow-hidden transition-all duration-500 mt-1 ${isLgScreen || isOpen
                ? "max-h-[600px] opacity-100 mt-5 pt-5 px-3"
                : "max-h-0 opacity-0"
              }`}
          >
            {/* Form Error */}
            {error.form && <p className="text-red-500 text-sm">{error.form}</p>}

            <div className="relative mb-4 w-full">
              <InputField
                label="Old Password"
                type={oldPasswordVisible ? "text" : "password"}
                value={oldPassword}
                onChange={handleOldPasswordChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={toggleOldPasswordVisibility}
                className="absolute right-3 top-3 text-gray-500"
              >
                {oldPasswordVisible ? <Eye size={22} /> : <EyeOff size={22} />}
              </button>
              {error.oldPassword && (
                <p className="text-red-400 text-sm">{error.oldPassword}</p>
              )}
            </div>

            <div className="relative mb-4 w-full">
              <InputField
                label="New Password"
                type={newPasswordVisible ? "text" : "password"}
                value={newPassword}
                onChange={handleNewPasswordChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="absolute right-3 top-3 text-gray-500"
              >
                {newPasswordVisible ? <Eye size={22} /> : <EyeOff size={22} />}
              </button>
              {error.newPassword && (
                <p className="text-red-400 text-sm">{error.newPassword}</p>
              )}
            </div>

            <div className="relative mb-4 w-full">
              <InputField
                label="Confirm New Password"
                type={confirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-3 text-gray-500"
              >
                {confirmPasswordVisible ? (
                  <Eye size={22} />
                ) : (
                  <EyeOff size={22} />
                )}
              </button>
              {error.confirmPassword && (
                <p className="text-red-400 text-sm">{error.confirmPassword}</p>
              )}
            </div>

            <div className="">
              <Button
                label="Change Password"
                onClick={handleChangePassword}
                type="button"
                loading={isLoading}
                disabled={
                  isLoading ||
                  !newPassword ||
                  confirmPassword !== newPassword ||
                  !oldPassword
                }
                className="text-base md:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}