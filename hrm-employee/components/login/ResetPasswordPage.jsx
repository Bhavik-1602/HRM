"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "../../assets/login/Logo_icon.png";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { Eye, EyeOff } from "lucide-react";
import { POST } from "@/helper/api_helper";
import { RESET_PASSWORD_URL } from "@/helper/url_helper";
import {  toast } from 'react-toastify';
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [error, setError] = useState({ newPassword: "", confirmPassword: "", form: "" });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState(false);
    const router = useRouter();

    const searchParams = useSearchParams();
    const resetPasswordToken = searchParams.get("token");

    // Handle New password input
    const handleNewPasswordChange = (e) => {
        const newPass = e.target.value;
        setNewPassword(newPass);

        // Validate password length
        if (newPass.length > 0 && newPass.length < 4) {
            setError((prev) => ({
                ...prev,
                newPassword: "Password must be at least 4 characters",
            }));
        } else {
            setError((prev) => ({ ...prev, newPassword: "" }));
        }
    };

    // Handle confirm password input
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

    // Handle Reset Password
    const handleResetPassword = async () => {
        setTouched(true);

        if (!newPassword || !confirmPassword) {
            setError((prev) => ({ ...prev, form: "All fields are required" }));
            return;
        }

        if (newPassword.length < 4) {
            setError((prev) => ({
                ...prev,
                newPassword: "Password must be at least 4 characters",
            }));
            return;
        }

        setError({ newPassword: "", confirmPassword: "", form: "" });
        setIsLoading(true);

        try {
            const response = await POST(RESET_PASSWORD_URL, { new_password:newPassword, reset_password_token:resetPasswordToken });
            const status = response.meta.status;
            if (status == 200) {
                const message = response.meta.message;
                toast.success(message);
                setIsLoading(false);
                router.push('/login');
            }

        } catch (e) {
            const errorMessage = e.response.data.meta.message;
            toast.error(errorMessage);
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible((prevState) => !prevState);
    };

    return (
        <div className="h-full flex items-center justify-center">
            <div className="w-full max-w-[1600px] flex flex-col md:flex-row items-center justify-center p-6">
                {/* Left side: Logo */}
                <div className="hidden md:flex justify-center items-center p-10">
                    <Image src={logo} alt="Company Logo" width={300} height={370} />
                </div>

                {/* Right side: Reset Password form */}
                <div className="flex flex-col justify-center items-center bg-white p-6 lg:p-8 rounded-2xl shadow-xl max-w-[500px] w-full">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
                        Create new password
                    </h2>

                    {/* Form Error */}
                    {error.form && (
                        <p className="text-red-500 text-sm mb-2">{error.form}</p>
                    )}


                    {/* Password Input */}
                    <div className="relative mb-3 md:mb-4 w-full">
                        <InputField
                            label="New Password"
                            type={passwordVisible ? "text" : "password"}
                            value={newPassword}
                            onChange={handleNewPasswordChange}
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
                        {error.newPassword && (
                            <p className="text-red-400 text-sm mt-1">{error.newPassword}</p>
                        )}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="relative mb-3 md:mb-4 w-full">
                        <InputField
                            label="Confirm New Password"
                            type={confirmPasswordVisible ? "text" : "password"}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            error=""
                            className="pr-10 text-base md:text-lg"
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            {confirmPasswordVisible ? <Eye size={22} /> : <EyeOff size={22} />}
                        </button>
                        {error.confirmPassword && (
                            <p className="text-red-400 text-sm mt-1">{error.confirmPassword}</p>
                        )}
                    </div>

                    {/* Login Button */}
                    <Button
                        label="Reset Password"
                        onClick={handleResetPassword}
                        type="button"
                        loading={isLoading}
                        disabled={isLoading || !newPassword || !confirmPassword}
                        className="w-full py-2 md:py-3 text-base md:text-lg"
                    />
                </div>
            </div>
        </div>
    );
}
