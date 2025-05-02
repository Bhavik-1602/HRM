"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "../../assets/login/Logo_icon.png";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { POST } from "@/helper/api_helper";
import { FORGOT_PASSWORD_URL } from "@/helper/url_helper";
import { toast } from 'react-toastify';
import { ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({ email: "", form: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const router = useRouter();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Handle email input and validate on typing
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setTouched(true);

    if (newEmail && !validateEmail(newEmail)) {
      setError((prev) => ({ ...prev, email: "Invalid email format" }));
    } else {
      setError((prev) => ({ ...prev, email: "" }));
    }
  };

  // Handle Submit
  const handleSubmit = async () => {
    setTouched(true);

    if (!email) {
      setError((prev) => ({ ...prev, form: "All fields are required" }));
      return;
    }

    if (!validateEmail(email)) {
      setError((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }


    setError({ email: "", form: "" });
    setIsLoading(true);

    try {
      const response = await POST(FORGOT_PASSWORD_URL, { work_email : email });
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

  const handleGoBack=()=>{
    router.push("/login");
  }

  return (
    <div className="h-full">

        {/* Go Back Button */}
        <button
          className="bg-[#F47B55] h-10 w-10 flex items-center text-white rounded-full top-10 cursor-pointer"
          onClick={handleGoBack}
        >
          {<ChevronLeft size={37} />}
        </button>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-[1600px] flex flex-col md:flex-row items-center justify-center p-6">
          {/* Left side: Logo */}
          <div className="hidden md:flex justify-center items-center p-10">
            <Image src={logo} alt="Company Logo" width={300} height={370} />
          </div>

          {/* Right side: Forgot Password form */}
          <div className="flex flex-col justify-center items-center bg-white p-6 lg:p-8 rounded-2xl shadow-xl max-w-[550px] w-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              Forgot Password?
            </h2>
            <p className="text-sm md:text-base text-gray-600 text-center mb-6">
              Enter your email, and we'll send you a link to reset your password.
            </p>

            {/* Form Error */}
            {error.form && (
              <p className="text-red-500 text-sm mb-2">{error.form}</p>
            )}

            {/* Email Input */}
            <div className="w-full relative mb-3 md:mb-4">
              <InputField
                label="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => setTouched(true)}
                error=""
                className="mb-1 text-base md:text-lg"
              />
              {touched && error.email && (
                <p className="text-red-400 text-sm mt-1">{error.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              label="Submit"
              onClick={handleSubmit}
              type="button"
              loading={isLoading}
              disabled={isLoading || !email}
              className="w-full py-2 md:py-3 text-base md:text-lg"
            />

          </div>
        </div>
      </div>
    </div>
  );
}
