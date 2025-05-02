"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "../../assets/login/Logo_icon.png";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { Eye, EyeOff } from "lucide-react";
import { POST } from "@/helper/api_helper";
import { LOGIN_URL } from "@/helper/url_helper";
import { TOKEN } from "@/config/constant";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useUser } from "@/stores/useUserStore"

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "", form: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUser();

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

  // Handle password input
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Validate password length
    if (newPassword.length > 0 && newPassword.length < 4) {
      setError((prev) => ({
        ...prev,
        password: "Password must be at least 4 characters",
      }));
    } else {
      setError((prev) => ({ ...prev, password: "" }));
    }
  };

//handle Login
  const handleLogin = async () => {
    setTouched(true);

    if (!email || !password) {
      setError((prev) => ({ ...prev, form: "All fields are required" }));
      return;
    }

    if (!validateEmail(email)) {
      setError((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }

    if (password.length < 4) {
      setError((prev) => ({
        ...prev,
        password: "Password must be at least 4 characters",
      }));
      return;
    }

    setError({ email: "", password: "", form: "" });
    setIsLoading(true);


    try {
      const response = await POST(LOGIN_URL, { work_email:email, password });

      const status = response.meta.status;
      if (status == 200) {
        const token = response.meta.token;
        const message = response.meta.message;
        const userData = response.data;
        localStorage.setItem(TOKEN, token);
        setUser(userData);

        toast.success(message);
        setIsLoading(false);
        router.push("/");
      }

    } catch (e) {
      setIsLoading(false);
      const errorMessage = e.response.data.meta.message;
      toast.error(errorMessage);
    }

  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleForgotPassword=()=>{
      router.push("/forgot-password")   
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-[1600px] flex flex-col md:flex-row items-center justify-center p-6">
        {/* Left side: Logo */}
        <div className="hidden md:flex justify-center items-center p-10">
          <Image src={logo} alt="Company Logo" width={300} height={370} />
        </div>

        {/* Right side: Sign-in form */}
        <div className="flex flex-col justify-center items-center bg-white p-6 lg:p-8 rounded-2xl shadow-xl max-w-[500px] w-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Login
          </h2>
          <p className="text-md md:text-lg text-gray-600 text-center mb-6">
            Welcome back!
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

          {/* Password Input */}
          <div className="relative mb-3 md:mb-4 w-full">
            <InputField
              label="Password"
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              error=""
              className="pr-10 text-base md:text-lg"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-500"
            >
              {passwordVisible ? <Eye size={22} /> : <EyeOff size={22} />}
            </button>
            {error.password && (
              <p className="text-red-400 text-sm mt-1">{error.password}</p>
            )}
          </div>

          <div className="flex justify-between items-center mb-4 md:mb-6 w-full">
            <label className="flex items-center text-sm md:text-lg text-gray-700">
              <input type="checkbox" className="mr-2 w-4 h-4 md:w-5 md:h-5" />{" "}
              Remember me
            </label>
            <a href="#" onClick={handleForgotPassword} className="text-orange-500 text-sm md:text-lg">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <Button
            label="Login"
            onClick={handleLogin}
            type="button"
            loading={isLoading}
            disabled={isLoading || !email || !password}
            className="w-full py-2 md:py-3 text-base md:text-lg"
          />
        </div>
      </div>
    </div>
  );
}
