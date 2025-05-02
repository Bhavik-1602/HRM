"use client"

import { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/common/Button";
import InputField from "@/components/common/InputField";
import SelectInput from "@/components/common/SelectInput";
import { useEmployeeStore } from "@/stores/useEmployeeStore";
import { useEffect } from "react";
import { UPDATE_EMPLOYEE_DETAILS } from "@/helper/url_helper";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, X, Pencil } from "lucide-react";
import axios from "axios";
import { TOKEN } from "@/config/constant";
import Image from "next/image";
import { useUser } from "@/stores/useUserStore"

const validationSchema = Yup.object({
  first_name: Yup.string(),
  last_name: Yup.string(),
  personal_email: Yup.string().email("Invalid email address"),
  personal_phone_number: Yup.string().matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  dob: Yup.date(),
  gender: Yup.string(),
  marital_status: Yup.string(),
  department: Yup.string(),
  reports_to: Yup.string(),
  blood_group: Yup.string(),
  proof_doc_name: Yup.string(),
  degree: Yup.string(),
  university_name: Yup.string(),
  college_name: Yup.string(),
  passing_year: Yup.string().matches(/^\d{4}$/, "Invalid year"),
  original_doc_submitted: Yup.boolean(),
  original_doc_name: Yup.string(),
  permanent_address_street_1: Yup.string(),
  permanent_address_street_2: Yup.string(),
  permanent_address_country: Yup.string(),
  permanent_address_state: Yup.string(),
  permanent_address_city: Yup.string(),
  permanent_address_postal_code: Yup.string().matches(/^\d{5,6}$/, "Invalid Postal Code"),
  temporary_address_street_1: Yup.string(),
  temporary_address_street_2: Yup.string(),
  temporary_address_country: Yup.string(),
  temporary_address_state: Yup.string(),
  temporary_address_city: Yup.string(),
  temporary_address_postal_code: Yup.string().matches(/^\d{5,6}$/, "Invalid Postal Code"),
  emergency_contact_name: Yup.string(),
  emergency_contact_relation: Yup.string(),
  emergency_contact_phone: Yup.string().matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

export default function EditPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { employee, getEmployee } = useEmployeeStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { user, setUser } = useUser();

  useEffect(() => {
    getEmployee();
  }, []);

  useEffect(() => {
    if (employee?.profile_image) {
      setProfilePreview(employee.profile_image);
    }
  }, [employee]);

  const initialValues = employee ? {
    selectedProfile: employee?.profile_image || "",
    first_name: employee?.first_name || "",
    last_name: employee?.last_name || "",
    personal_email: employee?.personal_email || "",
    personal_phone_number: employee?.personal_phone_number || "",
    dob: employee?.dob ? new Date(employee.dob).toISOString().split("T")[0] : "",
    gender: employee?.gender || "",
    marital_status: employee?.marital_status || "",
    department: employee?.department || "",
    reports_to: employee?.reports_to || "",
    blood_group: employee?.blood_group || "",
    proof_doc_name: employee?.proof_doc_name || "",
    degree: employee?.education_details?.degree || "",
    university_name: employee?.education_details?.university_name || "",
    college_name: employee?.education_details?.college_name || "",
    passing_year: employee?.education_details?.passing_year || "",
    original_doc_submitted: employee?.original_doc_submitted || false,
    original_doc_name: employee?.original_doc_name || "",
    permanent_address_street_1: employee?.permanent_address?.street1 || "",
    permanent_address_street_2: employee?.permanent_address?.street2 || "",
    permanent_address_country: employee?.permanent_address?.country || "",
    permanent_address_state: employee?.permanent_address?.state || "",
    permanent_address_city: employee?.permanent_address?.city || "",
    permanent_address_postal_code: employee?.permanent_address?.postal_code || "",
    temporary_address_street_1: employee?.temporary_address?.street1 || "",
    temporary_address_street_2: employee?.temporary_address?.street2 || "",
    temporary_address_country: employee?.temporary_address?.country || "",
    temporary_address_state: employee?.temporary_address?.state || "",
    temporary_address_city: employee?.temporary_address?.city || "",
    temporary_address_postal_code: employee?.temporary_address?.postal_code || "",
    emergency_contact_name: employee?.emergency_contact?.name || "",
    emergency_contact_relation: employee?.emergency_contact?.relationship || "",
    emergency_contact_phone: employee?.emergency_contact?.phone || "",
  } : {};

  // handle profile image upload
  const handleProfileImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);
      setProfileImage(file);
    }
  };

  //handle form submit
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);

      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        personal_email: values.personal_email,
        personal_phone_number: values.personal_phone_number,
        dob: values.dob,
        gender: values.gender,
        marital_status: values.marital_status,
        department: values.department,
        reports_to: values.reports_to,
        blood_group: values.blood_group,
        proof_doc_name: values.proof_doc_name,
        original_doc_submitted: values.original_doc_submitted,
        original_doc_name: values.original_doc_name,

        education_details: {
          degree: values.degree,
          university_name: values.university_name,
          college_name: values.college_name,
          passing_year: values.passing_year
        },

        permanent_address: {
          street1: values.permanent_address_street_1,
          street2: values.permanent_address_street_2,
          country: values.permanent_address_country,
          state: values.permanent_address_state,
          city: values.permanent_address_city,
          postal_code: values.permanent_address_postal_code
        },

        temporary_address: {
          street1: values.temporary_address_street_1,
          street2: values.temporary_address_street_2,
          country: values.temporary_address_country,
          state: values.temporary_address_state,
          city: values.temporary_address_city,
          postal_code: values.temporary_address_postal_code
        },

        emergency_contact: {
          name: values.emergency_contact_name,
          relationship: values.emergency_contact_relation,
          phone: values.emergency_contact_phone
        }
      };

      try {
        const token = localStorage.getItem(TOKEN);
        const response = await axios.put(`${API_URL}${UPDATE_EMPLOYEE_DETAILS}`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.data?.meta?.status === 200) {
          toast.success(response.data.meta.message);

          if (selectedFile) {
            await handleFileUpload(selectedFile);
          }
          if (profileImage) {
            await handleProfileUpload();
          }

          // update name at user store
          setUser({ ...user, name: payload.first_name });

          router.push("/account");
        }
      } catch (e) {
        toast.error(e.response?.data?.meta?.message || "Update failed!");
      } finally {
        setIsLoading(false);
      }
    }
  });

  // handle file upload
  const handleFileUpload = async (file) => {
    try {
      const fileFormData = new FormData();
      fileFormData.append('proof_doc', file);

      const token = localStorage.getItem(TOKEN);
      await axios.put(`${API_URL}${UPDATE_EMPLOYEE_DETAILS}`, fileFormData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
    } catch (error) {
      toast.error("File upload failed");
    }
  };

  //  handle profile upload 
  const handleProfileUpload = async () => {
    if (!profileImage) return;

    try {
      const fileFormData = new FormData();
      fileFormData.append('profile_image', profileImage);

      const token = localStorage.getItem(TOKEN);
      const response = await axios.put(`${API_URL}${UPDATE_EMPLOYEE_DETAILS}`, fileFormData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      const profile_image = response?.data?.data?.profile_image;
      setUser({ ...user, profile_image: profile_image });

    } catch (error) {
      toast.error("Profile image upload failed");
    }
  };

  //handle go back
  const handleGoBack = () => {
    router.push("/account")
  }

  return (
    <div className="md:max-w-full">

      {/* Go Back Button */}
      <div className="inline-block mb-4 mr-3 md:mb-0 md:mr-0">
        <button
          className="bg-[#F47B55] h-7 w-7 md:h-8 md:w-8 flex items-center justify-center text-white rounded-full top-10 cursor-pointer"
          onClick={handleGoBack}>
          {<ChevronLeft size={25} />}
        </button>
      </div>

      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold text-gray-700 mb-1">Edit Form</h1>
        <p className="text-gray-500 mb-3">Edit as you wish</p>

        <div className="p-4 border border-gray-300 rounded-lg shadow-md">
          <form className="space-y-8" onSubmit={formik.handleSubmit}>
            <div className="md:flex justify-evenly">
              <div className="">
                <div className="mb-2 text-sm text-gray-600">Profile Picture</div>
                <div className="relative">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {profilePreview ? (
                      <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Image src="/assets/Default-DP.png" alt="Default profile" width={70} height={70} />
                    )}
                  </div>

                  <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer">
                    <Pencil className="h-4 w-4" />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageUpload}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-grow md:ml-5 mt-10">
                <div className="md:col-span-6">
                  <InputField
                    name="first_name"
                    label="First Name"
                    type="text"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.first_name && formik.errors.first_name}
                  />
                </div>

                <div className="md:col-span-6">

                  <InputField
                    name="last_name"
                    label="Last Name"
                    type="text"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.last_name && formik.errors.last_name}
                  />
                </div>

                <div className="md:col-span-12">
                  <InputField
                    name="personal_email"
                    label="Personal Email"
                    type="email"
                    value={formik.values.personal_email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.personal_email && formik.errors.personal_email}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
              <div>
                <InputField
                  name="personal_phone_number"
                  label="Phone Number"
                  type="text"
                  value={formik.values.personal_phone_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.personal_phone_number && formik.errors.personal_phone_number}
                />
              </div>

              <div>
                <InputField
                  name="dob"
                  label="DOB"
                  type="date"
                  value={formik.values.dob}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.dob && formik.errors.dob}
                />
              </div>

              <div>
                <SelectInput
                  label="Gender"
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                  value={formik.values.gender}
                  onChange={(event) => formik.setFieldValue("gender", event.target.value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.gender && formik.errors.gender}
                />
              </div>

              <div>
                <SelectInput
                  label="Marital Status"
                  options={[
                    { value: "married", label: "Married" },
                    { value: "single", label: "Single" },
                    { value: "other", label: "Other" },
                  ]}
                  value={formik.values.marital_status}
                  onChange={(event) => formik.setFieldValue("marital_status", event.target.value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.marital_status && formik.errors.marital_status}
                />
              </div>

              <div>
                <InputField
                  name="department"
                  label="Department"
                  type="text"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.department && formik.errors.department}
                />
              </div>

              <div>
                <InputField
                  name="reports_to"
                  label="Reports to"
                  type="text"
                  value={formik.values.reports_to}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.reports_to && formik.errors.reports_to}
                />
              </div>

              <div>
                <SelectInput
                  label="Blood Group"
                  options={[
                    { value: "A+", label: "A+" },
                    { value: "A-", label: "A-" },
                    { value: "B+", label: "B+" },
                    { value: "B-", label: "B-" },
                    { value: "O+", label: "O+" },
                    { value: "O-", label: "O-" },
                    { value: "AB+", label: "AB+" },
                    { value: "AB-", label: "AB-" },
                  ]}
                  value={formik.values.blood_group}
                  onChange={(event) => formik.setFieldValue("blood_group", event.target.value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.blood_group && formik.errors.blood_group}
                />
              </div>

              <div>
                <SelectInput
                  label="Original Document Submitted?"
                  options={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" }
                  ]}
                  value={formik.values.original_doc_submitted}
                  onChange={(event) => formik.setFieldValue("original_doc_submitted", event.target.value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.original_doc_submitted && formik.errors.original_doc_submitted}
                />
              </div>

              <div>
                <InputField
                  name="original_doc_name"
                  label="Original Document Name"
                  type="text"
                  value={formik.values.original_doc_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.original_doc_name && formik.errors.original_doc_name}
                  disabled={!formik.values.original_doc_submitted}
                />
              </div>

              <div>
                <InputField
                  name="proof_doc_name"
                  label="Proof Document Name"
                  type="text"
                  value={formik.values.proof_doc_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.proof_doc_name && formik.errors.proof_doc_name}
                />
              </div>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proof Document Upload
              </label>
              <div
                className="border border-gray-300 bg-gray-100 rounded-md text-center flex flex-col items-center gap-2 cursor-pointer p-4"
                onClick={() => fileInputRef.current.click()}
              >
                <Upload className="text-gray-500" size={24} />
                <p className="text-sm text-gray-600">
                  <span className="text-blue-500 cursor-pointer">
                    Click to upload
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  Supported formats: SVG, PNG, WEBP, JPG, PDF (max. 5MB)
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                    }
                  }}
                  accept=".jpg,.jpeg,.png,.pdf,.webp,.svg"
                />
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between bg-gray-200 p-2 rounded-md mt-2">
                  <span className="text-sm text-gray-700">
                    {selectedFile.name}
                  </span>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500"
                    type="button"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Education Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <InputField
                    name="degree"
                    label="Degree"
                    type="text"
                    value={formik.values.degree}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.degree && formik.errors.degree}
                  />
                </div>

                <div>
                  <InputField
                    name="university_name"
                    label="University Name"
                    type="text"
                    value={formik.values.university_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.university_name && formik.errors.university_name}
                  />
                </div>

                <div>
                  <InputField
                    name="college_name"
                    label="College Name"
                    type="text"
                    value={formik.values.college_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.college_name && formik.errors.college_name}
                  />
                </div>

                <div>
                  <InputField
                    name="passing_year"
                    label="Passing Year"
                    type="text"
                    value={formik.values.passing_year}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.passing_year && formik.errors.passing_year}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Permanent Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <InputField
                    name="permanent_address_street_1"
                    label="Street 1"
                    type="text"
                    value={formik.values.permanent_address_street_1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.permanent_address_street_1 && formik.errors.permanent_address_street_1}
                  />
                </div>

                <div>
                  <InputField
                    name="permanent_address_street_2"
                    label="Street 2"
                    type="text"
                    value={formik.values.permanent_address_street_2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.permanent_address_street_2 && formik.errors.permanent_address_street_2}
                  />
                </div>

                <div>
                  <InputField
                    name="permanent_address_city"
                    label="City"
                    type="text"
                    value={formik.values.permanent_address_city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.permanent_address_city && formik.errors.permanent_address_city}
                  />
                </div>

                <div>
                  <InputField
                    name="permanent_address_state"
                    label="State/Province"
                    type="text"
                    value={formik.values.permanent_address_state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.permanent_address_state && formik.errors.permanent_address_state}
                  />
                </div>

                <div>
                  <SelectInput
                    label="Country"
                    options={[
                      { value: "Australia", label: "Australia" },
                      { value: "Canada", label: "Canada" },
                      { value: "India", label: "India" },
                      { value: "UK", label: "UK" },
                      { value: "USA", label: "USA" },
                    ]}
                    value={formik.values.permanent_address_country}
                    onChange={(event) => formik.setFieldValue("permanent_address_country", event.target.value)}
                    onBlur={formik.handleBlur}
                    error={formik.touched.permanent_address_country && formik.errors.permanent_address_country}
                  />
                </div>

                <div>
                  <InputField
                    name="permanent_address_postal_code"
                    label="ZIP/postal Code"
                    type="text"
                    value={formik.values.permanent_address_postal_code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.permanent_address_postal_code && formik.errors.permanent_address_postal_code}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Temporary Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <InputField
                    name="temporary_address_street_1"
                    label="Street 1"
                    type="text"
                    value={formik.values.temporary_address_street_1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.temporary_address_street_1 && formik.errors.temporary_address_street_1}
                  />
                </div>

                <div>
                  <InputField
                    name="temporary_address_street_2"
                    label="Street 2"
                    type="text"
                    value={formik.values.temporary_address_street_2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.temporary_address_street_2 && formik.errors.temporary_address_street_2}
                  />
                </div>

                <div>
                  <InputField
                    name="temporary_address_city"
                    label="City"
                    type="text"
                    value={formik.values.temporary_address_city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.temporary_address_city && formik.errors.temporary_address_city}
                  />
                </div>

                <div>
                  <InputField
                    name="temporary_address_state"
                    label="State/Province"
                    type="text"
                    value={formik.values.temporary_address_state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.temporary_address_state && formik.errors.temporary_address_state}
                  />
                </div>

                <div>
                  <SelectInput
                    label="Country"
                    options={[
                      { value: "Australia", label: "Australia" },
                      { value: "Canada", label: "Canada" },
                      { value: "India", label: "India" },
                      { value: "UK", label: "UK" },
                      { value: "USA", label: "USA" },
                    ]}
                    value={formik.values.temporary_address_country}
                    onChange={(event) => formik.setFieldValue("temporary_address_country", event.target.value)}
                    onBlur={formik.handleBlur}
                    error={formik.touched.temporary_address_country && formik.errors.temporary_address_country}
                  />
                </div>

                <div>
                  <InputField
                    name="temporary_address_postal_code"
                    label="ZIP/postal Code"
                    type="text"
                    value={formik.values.temporary_address_postal_code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.temporary_address_postal_code && formik.errors.temporary_address_postal_code}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <InputField
                    name="emergency_contact_name"
                    label="Name"
                    type="text"
                    value={formik.values.emergency_contact_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.emergency_contact_name && formik.errors.emergency_contact_name}
                  />
                </div>

                <div>
                  <InputField
                    name="emergency_contact_relation"
                    label="Relation"
                    type="text"
                    value={formik.values.emergency_contact_relation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.emergency_contact_relation && formik.errors.emergency_contact_relation}
                  />
                </div>

                <div>
                  <InputField
                    name="emergency_contact_phone"
                    label="Phone Number"
                    type="text"
                    value={formik.values.emergency_contact_phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.emergency_contact_phone && formik.errors.emergency_contact_phone}
                  />
                </div>

              </div>
            </div>

            <div className="flex justify-self-end">
              <Button
                label="Update"
                type="button"
                loading={isLoading}
                disabled={isLoading}
                onClick={formik.handleSubmit}
                className="w-full py-2 md:py-3 text-base md:text-lg"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}