"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { useEmployeeStore } from "@/stores/useEmployeeStore";
import Button from "@/components/common/Button";

export default function MyAccountPage() {

    const router = useRouter();
    const { employee, getEmployee } = useEmployeeStore();

    useEffect(() => {
        getEmployee();
    }, []);

    const handleEditDetails = () => {
        router.push("/edit-details")
    }

    const formatValue = (value) => (value && value !== "-" ? value : "-");

    const formatDate = (date) => {
        if (!date) return "-";
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const renderTableRow = (label, value) => (
        <tr className="rounded-lg">
            <td className="w-1/4 text-gray-600 text-sm sm:text-base font-bold py-1 md:px-6">{label}:</td>
            <td className="w-3/4 text-gray-900 text-sm sm:text-base font-light py-1 px-1 md:px-6">{formatValue(value)}</td>
        </tr>
    );

    const renderSectionTitle = (title) => (
        <tr>
            <td colSpan="2" className="text-xl font-semibold text-gray-800 py-2 px-3 mt-4">
                {title}
            </td>
        </tr>
    );

    return (
        <div className="md:max-w-full">
            {/* Header Section */}
            <div className="flex items-center w-full justify-between mb-6 pb-4 px-7">
                <div className="flex items-center space-x-4">
                    {/* Profile Picture */}
                    <div className="rounded-full h-15 w-18 md:w-32 md:h-32 flex items-center justify-center overflow-hidden shadow-md">
                    
                        {employee?.profile_image != "" ? (
                            <img src={employee?.profile_image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <Image
                            src="/assets/Default-DP.png"
                            alt="Profile"
                            width={80}
                            height={80}
                            className="object-cover"
                        />
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg md:text-2xl font-semibold text-gray-800">
                            {formatValue(employee?.first_name)} {formatValue(employee?.last_name)}
                        </h2>
                        <p className="text-gray-500">{formatValue(employee?.job_title)}</p>
                    </div>
                </div>
                {/* Edit Button */}
                <div className="flex w-1/2 justify-end">
                    <div className="md:w-40 w-20 md:mr-4 text-sm md:text-lg">
                        <Button
                            label="Edit Profile"
                            onClick={handleEditDetails}
                            className="text-white px-6 py-2 rounded-md shadow-md hover:opacity-80 transition"
                            disabled={false}
                            type="button"
                            loadingText="Loading..."
                            fullWidth={false}
                        />
                    </div>
                </div>
            </div>

            {/* Profile Details */}
            <div className="relative mx-auto px-4 w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Details</h1>
                <div className="p-4 rounded-lg mb-3 shadow-md bg-white space-y-3">
                    {/* Contact Information */}
                    <div className="p-4 rounded-lg shadow-md border border-gray-200">
                        <table className="w-full">
                            <tbody>
                                {renderSectionTitle("Contact Information")}
                                {renderTableRow("Work Email", employee?.work_email)}
                                {renderTableRow("Personal Email", employee?.personal_email)}
                                {renderTableRow("Phone Number", employee?.personal_phone_number)}
                            </tbody>
                        </table>
                    </div>

                    {/* Personal Information */}
                    <div className="p-4 rounded-lg shadow-md border border-gray-200">
                        <table className="w-full">
                            <tbody>
                                {renderSectionTitle("Personal Information")}
                                {renderTableRow("Date of Birth", employee?.dob ? formatDate(employee.dob) : null)}
                                {renderTableRow("Gender", employee?.gender)}
                                {renderTableRow("Marital Status", employee?.marital_status)}
                                {renderTableRow("Blood Group", employee?.blood_group)}
                            </tbody>
                        </table>
                    </div>

                    {/* Professional Information */}
                    <div className="p-4 rounded-lg shadow-md border border-gray-200">
                        <table className="w-full">
                            <tbody>
                                {renderSectionTitle("Professional Information")}
                                {renderTableRow("Employee Code", employee?.employee_code)}
                                {renderTableRow("Job Title", employee?.job_title)}
                                {renderTableRow("Department", employee?.department)}
                                {renderTableRow("Reports To", employee?.reports_to)}
                                {renderTableRow("Employee Type", employee?.employee_type?.employee_type)}
                                {renderTableRow("Joining Date", employee?.joining_date ? formatDate(employee.joining_date) : null)}
                                {renderTableRow("Last Working Day", employee?.last_working_day_date ? formatDate(employee.last_working_day_date) : null)}
                            </tbody>
                        </table>
                    </div>

                    {/* Address Section */}
                    <div className="p-4 rounded-lg shadow-md border border-gray-200">
                        <table className="w-full">
                            <tbody>
                                {renderSectionTitle("Address Information")}
                                <tr>
                                    <td colSpan="2" className="font-bold text-gray-600 py-2">Permanent Address:</td>
                                </tr>
                                {renderTableRow("Street 1", employee?.permanent_address?.street1)}
                                {renderTableRow("Street 2", employee?.permanent_address?.street2)}
                                {renderTableRow("City", employee?.permanent_address?.city)}
                                {renderTableRow("State", employee?.permanent_address?.state)}
                                {renderTableRow("Postal Code", employee?.permanent_address?.postal_code)}
                                {renderTableRow("Country", employee?.permanent_address?.country)}

                                <tr>
                                    <td colSpan="2" className="font-bold text-gray-600 py-2 mt-2">Temporary Address:</td>
                                </tr>
                                {renderTableRow("Street 1", employee?.temporary_address?.street1)}
                                {renderTableRow("Street 2", employee?.temporary_address?.street2)}
                                {renderTableRow("City", employee?.temporary_address?.city)}
                                {renderTableRow("State", employee?.temporary_address?.state)}
                                {renderTableRow("Postal Code", employee?.temporary_address?.postal_code)}
                                {renderTableRow("Country", employee?.temporary_address?.country)}
                            </tbody>
                        </table>
                    </div>

                    {/* Education Details Section */}
                    <div className="p-4 rounded-lg shadow-md border border-gray-200">
                        <table className="w-full">
                            <tbody>
                                {renderSectionTitle("Education Details")}
                                {renderTableRow("Degree", employee?.education_details?.degree)}
                                {renderTableRow("University Name", employee?.education_details?.university_name)}
                                {renderTableRow("College Name", employee?.education_details?.college_name)}
                                {renderTableRow("Passing Year", employee?.education_details?.passing_year)}
                            </tbody>
                        </table>
                    </div>

                    {/* Additional Details Section */}
                    <div className="p-4 rounded-lg shadow-md border border-gray-200">
                        <table className="w-full">
                            <tbody>
                                {renderSectionTitle("Additional Information")}
                                {renderTableRow("Original Documents Submitted", employee?.original_doc_submitted?.[0] === "true" ? "Yes" : "No")}
                                {renderTableRow("Original Document Name", employee?.original_doc_name)}
                                {renderTableRow("Proof Document Name", employee?.proof_doc_name)}
                                {renderTableRow("Proof Document", <a className="text-blue-600 underline hover:text-blue-800" href={employee?.proof_doc} target="_blank" rel="noopener noreferrer">Show Document</a>)}
                            </tbody>
                        </table>
                    </div>

                    {/* Emergency Contact Section */}
                    <div className="p-4 rounded-lg shadow-md border border-gray-200">
                        <table className="w-full">
                            <tbody>
                                {renderSectionTitle("Emergency Contact")}
                                {renderTableRow("Name", employee?.emergency_contact?.name)}
                                {renderTableRow("Relationship", employee?.emergency_contact?.relationship)}
                                {renderTableRow("Phone Number", employee?.emergency_contact?.phone)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}