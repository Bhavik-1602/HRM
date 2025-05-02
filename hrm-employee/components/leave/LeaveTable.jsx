"use client";

import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Edit,
  Trash2,
  X,
  Minus,
} from "lucide-react";
import Loader from "@/components/common/Loader";
import TextareaField from "@/components/common/TextareaField";
import Button from "@/components/common/Button";
import { GET, PUT } from "@/helper/api_helper";
import { useUser } from "@/stores/useUserStore";
import {
  LEAVE_URL,
  LEAVE_APPLY_URL,
  LEAVE_UPDATE_URL,
  LEAVE_DELETE_URL,
} from "@/helper/url_helper";
import { TOKEN } from "@/config/constant";
import { toast } from "react-toastify";
import DateInput from "@/components/common/DateField";
import { useLeaveTypeStore } from "@/stores/useLeaveTypeStore";
import InputField from "@/components/common/InputField";
import SelectInput from "@/components/common/SelectInput";
import Pagination from "@/components/common/Pagination";
import axios from "axios";

const LeaveTable = () => {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [leaveForm, setLeaveForm] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
    halfday_type: "",
  });
  const [documentsPreview, setDocumentsPreview] = useState([]);

  const [validationErrors, setValidationErrors] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
    halfday_type: "",
  });
  const { leave_types, getLeaveType } = useLeaveTypeStore();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // filter states
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchLeaves();
    setLoading(true);
  }, [user, currentPage, pageSize, month, year, startDate, endDate]);

  useEffect(() => {
    getLeaveType();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!leaveForm.leave_type) {
      errors.leave_type = "Leave type is required.";
    }
    if (!leaveForm.start_date) {
      errors.start_date = "Start date is required.";
    }
    if (!leaveForm.end_date) {
      errors.end_date = "End date is required.";
    }
    if (!leaveForm.reason) {
      errors.reason = "Reason is required.";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const fileInputRef = useRef(null);

  // handle file change
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    // Check if adding new files would exceed the limit of 5
    if (uploadedFiles.length + files.length > 5) {
      toast.error("You can only upload a maximum of 5 files");
      return;
    }

    // Check file size (5MB limit)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("Some files exceed the 5MB size limit");
      return;
    }

    // Add new files to the existing array
    setUploadedFiles(prevFiles => [...prevFiles, ...files]);

    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const removeAllFiles = () => {
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // handle fetch leaves
  const fetchLeaves = async () => {
    const token = localStorage.getItem(TOKEN);
    if (!token) return;
    setLoading(true);

    try {
      const response = await GET(
        `${LEAVE_URL}?page=${currentPage}&limit=${pageSize}&month=${month}&year=${year}&start_date=${startDate}&end_date=${endDate}`
      );
      setLeaveData(response?.data || []);
      setTotalPages(response?.meta?.pagination?.totalPages || 1);
      setTotalRecords(response?.meta?.pagination?.totalItems || 0);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error fetching leave data."
      );
      setLeaveData([]);
    } finally {
      setLoading(false);
    }
  };

  // format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  // calculate leave days
  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const difference = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return difference > 0 ? difference : 0;
  };

  // handle submit apply and edit leave
  const handleSubmit = async () => {
    const token = localStorage.getItem(TOKEN);
    if (!token) return;

    if (!validateForm()) {
      return;
    }

    try {
      let requestBody = {};

      // Create FormData for handling file uploads
      const formData = new FormData();

      // Prepare the leave data
      if (leaveForm.halfday_type != "Full Day") {
        requestBody = { ...leaveForm };
      } else {
        requestBody = {
          start_date: leaveForm.start_date,
          end_date: leaveForm.end_date,
          leave_type: leaveForm.leave_type,
          reason: leaveForm.reason,
        };
      }

      // Add leave request data to form data
      Object.keys(requestBody).forEach(key => {
        formData.append(key, requestBody[key]);
      });

      // Add all files to the form data
      uploadedFiles.forEach((file) => {
        formData.append('leave_doc', file);
      });

      const url = isEditing
        ? `${LEAVE_UPDATE_URL}/${selectedLeaveId}`
        : LEAVE_APPLY_URL;

      // Use axios for better FormData support
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const method = isEditing ? 'put' : 'post';

      const response = await axios({
        method,
        url: `${API_URL}${url}`,
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.meta && response.data.meta.message) {
        toast.success(response.data.meta.message);
      } else {
        toast.success(
          isEditing
            ? "Leave updated successfully!"
            : "Leave applied successfully!"
        );
      }

      fetchLeaves();
      handleCloseModal();

      setUploadedFiles([]);
      setLeaveForm({
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: "",
        halfday_type: "",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const errorMessage = error.response?.data?.meta?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  // handle delete leave
  const handleDelete = async () => {
    const token = localStorage.getItem(TOKEN);
    if (!token || !selectedLeaveId) return;

    try {
      const response = await PUT(`${LEAVE_DELETE_URL}/${selectedLeaveId}`, {
        cancel: true,
      });
      const message = response.meta.message;
      toast.success(message);
      fetchLeaves();
      setShowConfirmModal(false);
      setSelectedLeaveId(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.meta?.message ||
        "You can only cancel request with Pending status";
      toast.error(errorMessage);
      setShowConfirmModal(false);
    }
  };

  // handle delete leave button
  const handleDeleteClick = (id) => {
    setSelectedLeaveId(id);
    setShowConfirmModal(true);
  };

  // handle start date change
  const handleStartDateChange = (date) => {
    // Convert to YYYY-MM-DD format if it's a Date object
    const formattedDate =
      date instanceof Date ? date.toISOString().split("T")[0] : date;

    setLeaveForm({
      ...leaveForm,
      start_date: formattedDate,
    });

    // Clear error if dates are valid
    if (leaveForm.end_date && formattedDate <= leaveForm.end_date) {
      setError("");
    }
  };

  // handle end date change
  const handleEndDateChange = (date) => {
    // Convert to YYYY-MM-DD format if it's a Date object
    const formattedDate =
      date instanceof Date ? date.toISOString().split("T")[0] : date;

    // Validate date range
    if (leaveForm.start_date && formattedDate < leaveForm.start_date) {
      setError("End date cannot be before start date.");
    } else {
      setError("");
    }

    setLeaveForm({
      ...leaveForm,
      end_date: formattedDate,
    });
  };

  // handle edit form
  const handleEdit = (leave) => {
    setSelectedLeaveId(leave._id);

    // Convert ISO dates to YYYY-MM-DD format
    const formatDateForInput = (isoDate) => {
      if (!isoDate) return "";
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // set incoming leave data to fields
    setLeaveForm({
      leave_type: leave.leave_type?._id || leave.leave_type || "",
      start_date: formatDateForInput(leave.start_date),
      end_date: formatDateForInput(leave.end_date),
      reason: leave.reason || "",
      halfday_type: leave.halfday_type || "Full Day",
    });

    setDocumentsPreview([...leave.leave_doc]);
    // Clear any previously uploaded files
    setUploadedFiles([]);

    setIsEditing(true);
    setShowModal(true);
  };

  // handle close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedLeaveId(null);
    setLeaveForm({
      leave_type: "",
      start_date: "",
      end_date: "",
      reason: "",
      halfday_type: "",
    });

    setValidationErrors({
      leave_type: "",
      start_date: "",
      end_date: "",
      reason: "",
      halfday_type: "",
    });

    setDocumentsPreview([]);
    setUploadedFiles([]);
  };

  // handle page size
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // handle clear filter
  const handleClear = () => {
    setMonth("");
    setYear("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className=" px-2">
      <div className="flex justify-start mt-4 mb-5 w-40">
        <Button
          label="Apply For Leave"
          onClick={() => setShowModal(true)}
          className="w-auto px-6 mt-4"
        />
      </div>

      {/* filters  */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
          <>
            {/* rows  per page */}
            <div>
              <SelectInput
                label="Items per page"
                value={pageSize}
                onChange={handlePageSizeChange}
                options={[
                  { label: "5", value: 5 },
                  { label: "10", value: 10 },
                  { label: "20", value: 20 },
                ]}
              />
            </div>
            <div>
              <SelectInput
                label="Month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                options={[
                  { label: "Select month", value: "" },
                  { label: "January", value: 1 },
                  { label: "February", value: 2 },
                  { label: "March", value: 3 },
                  { label: "April", value: 4 },
                  { label: "May", value: 5 },
                  { label: "June", value: 6 },
                  { label: "July", value: 7 },
                  { label: "August", value: 8 },
                  { label: "September", value: 9 },
                  { label: "October", value: 10 },
                  { label: "November", value: 11 },
                  { label: "December", value: 12 },
                ]}
              />
            </div>
            <div>
              <SelectInput
                label="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                options={[
                  { label: "Select Year", value: "" },
                  ...[...Array(5).keys()].map((y) => ({
                    label: `${new Date().getFullYear() - y}`,
                    value: new Date().getFullYear() - y,
                  })),
                ]}
              />
            </div>
            <div>
              <InputField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <InputField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Button
                type="button"
                onClick={handleClear}
                label={"clear"}
              ></Button>
            </div>
          </>
        </div>
      </div>

      {/* leaves table  */}
      <div className="mt-4 w-full overflow-x-auto">
        {loading ? (
          <Loader />
        ) : Array.isArray(leaveData) && leaveData.length > 0 ? (
          <>
            <table className="min-w-full border border-gray-300 text-gray-700">
              <thead className=" bg-[#FFE1D8] sticky top-0 ">
                <tr>
                  <th className="px-6 py-3 border-r border-gray-300">
                    Start Date
                  </th>
                  <th className="px-6 py-3 border-r border-gray-300">
                    End Date
                  </th>
                  <th className="px-6 py-3 border-r border-gray-300">Days</th>
                  <th className="px-6 py-3 border-r border-gray-300">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 border-r border-gray-300">Status</th>
                  <th className="px-6 py-3 border-r border-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaveData?.map((leave) => (
                  <tr
                    key={leave._id}
                    className="border border-gray-300 text-xs md:text-sm"
                  >
                    <td className="px-6 py-3  border-r border-gray-300 text-center">
                      {formatDate(leave.start_date)}
                    </td>
                    <td className="px-6 py-3 border-r border-gray-300 text-center">
                      {formatDate(leave.end_date)}
                    </td>
                    <td className="px-6 py-3 border-r border-gray-300 text-center">
                      {leave?.halfday_type == null ? calculateLeaveDays(leave.start_date, leave.end_date) : "0.5"}
                    </td>
                    <td className="px-6 py-3 border-r border-gray-300 text-center">
                      {leave.leave_type?.leave_type}
                    </td>
                    <td className="px-6 py-3 border-r border-gray-300 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-white ${leave.status === "Approved"
                          ? "bg-green-500"
                          : leave.status === "Pending"
                            ? "bg-yellow-400"
                            : "bg-red-500"
                          }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="p-4 border-r border-gray-300 text-center flex justify-center gap-2">
                      {leave.status === "Pending" ? (
                        <>
                          <button
                            onClick={() => {
                              handleEdit(leave);
                            }}
                          >
                            <Edit size={18} className="text-orange-500" />
                          </button>

                          <button onClick={() => handleDeleteClick(leave._id)}>
                            <Trash2 size={18} className="text-orange-500" />
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-orange-500">
                            <Minus />
                          </p>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div>
            <table className="min-w-full border border-gray-300 text-gray-700">
              <thead className="bg-[#FFE1D8] sticky top-0">
                <tr>
                  <th className="px-6 py-3 border-r border-gray-300">
                    Start Date
                  </th>
                  <th className="px-6 py-3 border-r border-gray-300">
                    End Date
                  </th>
                  <th className="px-6 py-3 border-r border-gray-300">Days</th>
                  <th className="px-6 py-3 border-r border-gray-300">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 border-r border-gray-300">
                    Applied On
                  </th>
                  <th className="px-6 py-3 border-r border-gray-300">Status</th>
                  <th className="px-6 py-3 border-r border-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    No leave requests available.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* apply and edit modal*/}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#12112499] bg-opacity-40 z-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md sm:max-w-2xl rounded-lg shadow-lg flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="bg-[#FFE1D8] p-4 rounded-t-lg">
              <h2 className="text-lg text-center font-semibold">
                {isEditing ? "Edit Leave" : "Apply For Leave"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="flex flex-col space-y-1">
                  <SelectInput
                    value={leaveForm.leave_type || ""}
                    onChange={(e) => {
                      setLeaveForm({
                        ...leaveForm,
                        leave_type: e.target.value,
                      });
                      setValidationErrors({
                        ...validationErrors,
                        leave_type: "",
                      });
                    }}
                    options={[
                      ...(leave_types || []).map((leave) => ({
                        label: leave.leave_type,
                        value: leave._id,
                      })),
                    ]}
                    placeholder="Leave Type"
                    error={validationErrors.leave_type}
                  />
                </div>

                {/* Half Day Type Selector */}
                <div className="flex flex-col space-y-1">
                  <SelectInput
                    value={leaveForm.halfday_type ?? ""}
                    onChange={(e) => {
                      setLeaveForm({
                        ...leaveForm,
                        halfday_type: e.target.value,
                      });
                    }}
                    options={[
                      { label: "Full Day", value: "Full Day" },
                      { label: "Half Day (1st half)", value: "First" },
                      { label: "Half Day (2nd half)", value: "Second" },
                    ]}
                    placeholder="Day Type"
                    error={validationErrors.halfday_type}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="flex flex-col space-y-1">
                  <DateInput
                    className="border p-2 text-gray-500 border-gray-300 rounded-lg w-full bg-white focus:ring-orange-300 outline-none"
                    label="Start Date"
                    selected={leaveForm.start_date}
                    onChange={handleStartDateChange}
                    required
                  />
                  {validationErrors.start_date && (
                    <p className="text-red-500 text-sm">
                      {validationErrors.start_date}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-1">
                  <DateInput
                    className="border p-2 text-gray-500 border-gray-300 rounded-lg w-full bg-white focus:ring-orange-300 outline-none"
                    label="End Date"
                    selected={leaveForm.end_date}
                    onChange={handleEndDateChange}
                    required
                  />
                  {validationErrors.end_date && (
                    <p className="text-red-500 text-sm">
                      {validationErrors.end_date}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <TextareaField
                  placeholder="Reason"
                  value={leaveForm.reason}
                  onChange={(e) => {
                    setLeaveForm({ ...leaveForm, reason: e.target.value });
                    setValidationErrors({ ...validationErrors, reason: "" });
                  }}
                  required
                />
                {validationErrors.reason && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.reason}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supporting Documents (Max 5 files, 5MB each)
                </label>
                <div
                  className="border border-gray-300 bg-gray-100 rounded-md text-center flex flex-col items-center gap-2 cursor-pointer p-4"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Upload className="text-gray-500" size={24} />
                  <p className="text-sm text-gray-600">
                    <span className="text-blue-500 cursor-pointer">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    Supported formats: PNG, JPG, PDF (max. 5MB each)
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf,.webp,.svg"
                  />
                </div>

                {/* list previously uploaded document */}
                {documentsPreview.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold">Previous Uploaded Documents:</p>
                    <ul className="list-none list-inside flex">
                      {documentsPreview.map((doc, index) => (
                        <li key={index} className="mr-3">
                          <a href={doc} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            Document {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* File list with individual delete buttons */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Selected Files ({uploadedFiles.length}/5)
                      </span>
                      <button
                        onClick={removeAllFiles}
                        className="text-xs text-red-500 hover:text-red-700"
                        type="button"
                      >
                        Remove All
                      </button>
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-200 p-2 rounded-md mb-2">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-700 truncate max-w-xs">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500"
                            type="button"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end ml-auto w-60 p-3 rounded-b-lg  bg-white border-t border-gray-200 ">
              <Button
                label="Close"
                onClick={handleCloseModal}
                className="mr-2"
                btnType="cancel"
              />
              <Button
                label={isEditing ? "Update" : "Save"}
                onClick={handleSubmit}
                className="px-6"
              />
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center bg-[#12112499] justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-[400px] mx-4">
            {/* Header */}
            <div className="bg-[#FFE1D8] p-4 rounded-t-lg">
              <h3 className="text-xl font-semibold text-gray-800 text-center">
                Confirm Deletion
              </h3>
            </div>

            {/* Body */}
            <div className="p-4">
              <p className="text-sm text-gray-600 text-center mb-4">
                Are you sure you want to delete this leave request? This action
                cannot be undone.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  label="Delete"
                  onClick={handleDelete}
                  className="w-full sm:w-auto"
                />
                <Button
                  label="Cancel"
                  onClick={() => setShowConfirmModal(false)}
                  btnType="cancel"
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveTable;