import { useEffect,useState } from "react";
import {
  Card,
  Select,
  Option,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import {
  addRecordsCertificateStud,
  uploadRecordsCertificateStud,
  updateRecordsCertificateStud,
  getRecordCertificateByID
} from "./API_Routes";
// Required field indicator component
const RequiredField = () => (
  <span className="text-red-500 ml-1">*</span>
);

export default function Certificate() {
  const [errors, setErrors] = useState({});
  const [isFinancialSupport, setIsFinancialSupport] = useState(false);
  const [uploadedFilePaths, setUploadedFilePaths] = useState({});
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [tableName, setTableName] = useState("");
  const [id, setId] = useState(null);
  const location = useLocation();

  const [formData, setFormData] = useState({
    S_ID: null,
    Username: currentUser?.Username,
    Academic_Year: "",
    Student_Name: currentUser?.Name,
    Roll_No: null,
    Department: "",
    Class: "",
    Certificate_Course_Title: "",
    Organized_By: "",
    Place: "",
    Mode_of_Course: "",
    Duration: "",
    Start_Date: "",
    End_Date: "",
    Financial_support_given_by_institute_in_INR: "",
    Award: "",
    Award_Prize_Money: "",
    Upload_Certificates: null,
    Upload_Evidence: null,
  });

  const fetchRecord = async (tableName, table_id) => {
    try {
      if (table_id !== null) {
        const recordCertificateURL = getRecordCertificateByID(
          table_id,
          currentUser?.Username
        );
        const response = await axios.get(recordCertificateURL);
        setFormData(response.data.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
      const params = new URLSearchParams(location.search);
      const tableNames = params.get("tableName");
      const table_id = params.get("id");
  
      if (tableNames) {
        setTableName(tableNames);
      }
  
      if (table_id !== null) {
        setId(table_id);
        fetchRecord(tableNames, table_id);
      }
    }, [location, currentUser?.Username]);


    
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = {
      Academic_Year: "Academic Year",
      Department: "Department",
      Roll_No: "Roll No",
      Class: "Year of Study",
      Certificate_Course_Title: "Certificate Course Title",
      Organized_By: "Organized By",
      Place: "Place",
      Mode_of_Course: "Mode of Course",
      Duration: "Duration",
      Start_Date: "Start Date",
      End_Date: "End Date",
      Award: "Award",
      Award_Prize_Money: "Award Prize Money"
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field]) {
        newErrors[field] = `${label} is required`;
      }
    });

    // Roll No validation
    if (formData.Roll_No && !(/^\d{5}$/.test(formData.Roll_No))) {
      newErrors.Roll_No = "Roll No must be a 5-digit number";
    }

    // Date validation
    if (formData.Start_Date && formData.End_Date) {
      const startDate = new Date(formData.Start_Date);
      const endDate = new Date(formData.End_Date);
      if (endDate < startDate) {
        newErrors.End_Date = "End date cannot be before start date";
      }
    }

    // Duration validation
    if (formData.Duration && (isNaN(formData.Duration) || formData.Duration <= 0)) {
      newErrors.Duration = "Duration must be a positive number";
    }

    // Financial support validation
    if (isFinancialSupport) {
      if (!formData.Financial_support_given_by_institute_in_INR) {
        newErrors.Financial_support_given_by_institute_in_INR = "Financial support amount is required";
      }
      if (!formData.Upload_Evidence) {
        newErrors.Upload_Evidence = "Evidence document is required";
      }
    }

    // Certificate validation
    if (!formData.Upload_Certificates) {
      newErrors.Upload_Certificates = "Completion certificate is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateAcademicYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const Options = [];

    for (let year = 2023; year <= currentYear; year++) {
      const academicYearStart = `${year}-${year + 1}`;
      Options.push(
        <Option key={academicYearStart} value={academicYearStart}>
          {academicYearStart}
        </Option>
      );
    }

    return Options;
  };

  const handleOnChange = (e) => {
    const { id, value, type, files } = e.target;
    setFormData({
      ...formData,
      [id]: type === "file" ? (files && files.length > 0 ? files[0] : null) : value,
    });
    // Clear error when field is modified
    if (errors[id]) {
      setErrors({ ...errors, [id]: null });
    }
  };

  const handleFileUpload = async (files) => {
    console.log("file as:", files);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("username", currentUser?.Username);
      queryParams.append("role", currentUser?.Role);
      queryParams.append("tableName", "student_certificate_course");

      const formDataForFile = new FormData();
      const columnNames = [];
      if (formData.Upload_Certificates) {
        formDataForFile.append("files", formData.Upload_Certificates);
        columnNames.push("Upload_Certificates");
      }
      if (formData.Upload_Evidence) {
        formDataForFile.append("files", formData.Upload_Evidence);
        columnNames.push("Upload_Evidence");
      }

      queryParams.append("columnNames", columnNames.join(","));
      const url = `${uploadRecordsCertificateStud}?${queryParams.toString()}`;

      const response = await axios.post(url, formDataForFile, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response?.data?.uploadResults;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error?.response?.data?.message || "Error uploading file", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const errorMessages = Object.values(errors).join(", ");
      toast.error(errorMessages, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    try {
      const filesToUpload = [];
      if (isFinancialSupport) {
        filesToUpload.push(formData.Upload_Evidence);
      }
      if (formData.Upload_Certificates !== null) {
        filesToUpload.push(formData.Upload_Certificates);
      }

      const uploadResults = await handleFileUpload(filesToUpload);
      const updatedUploadedFilePaths = { ...uploadedFilePaths };

      uploadResults.forEach((result) => {
        updatedUploadedFilePaths[result.columnName] = result.filePath;
      });

      setUploadedFilePaths(updatedUploadedFilePaths);

      const formDataWithFilePath = {
        ...formData,
        ...updatedUploadedFilePaths,
      };

      await axios.post(addRecordsCertificateStud, formDataWithFilePath);

      toast.success("Record Added Successfully", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      navigate("/s/data");
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${updateRecordsCertificateStud}?username=${currentUser?.Username}&S_ID=${id}`,
        formData
      );

      toast.success("Record Updated Successfully", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      navigate("/s/data");
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred while updating", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  const renderFieldError = (fieldName) => (
    errors[fieldName] && (
      <Typography color="red" className="mt-1 text-sm">
        {errors[fieldName]}
      </Typography>
    )
  );
  
  return (
    <>
      <Card
        color="transparent"
        shadow={false}
        className="border border-gray-300 w-85 mx-auto p-2 my-2 rounded-md"
      >
        <Typography
          variant="h4"
          color="blue-gray"
          className="mx-auto underline underline-offset-2"
        >
          Certificate Course Attended
        </Typography>

        <form className="mt-8 mb-2" onSubmit={id ? handleUpdate : handleSubmit}>
          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Department<RequiredField />
              </Typography>
              <Select
                id="Department"
                size="lg"
                label="Department"
                value={formData.Department}
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Department", value },
                  })
                }
                error={!!errors.Department}
              >
                <Option value="CS">CS</Option>
                <Option value="IT">IT</Option>
                <Option value="EnTC">EnTC</Option>
                <Option value="FE">FE</Option>
              </Select>
              {renderFieldError("Department")}
            </div>
            
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Academic Year<RequiredField />
              </Typography>
              <Select
                size="lg"
                id="Academic_Year"
                value={formData.Academic_Year}
                label="Academic Year"
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Academic_Year", value },
                  })
                }
                error={!!errors.Academic_Year}
              >
                {generateAcademicYearOptions()}
              </Select>
              {renderFieldError("Academic_Year")}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Year of Study<RequiredField />
              </Typography>
              <Select
                id="Class"
                size="lg"
                label="Class"
                value={formData.Class}
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Class", value },
                  })
                }
                error={!!errors.Class}
              >
                <Option value="FE">FE</Option>
                <Option value="SE">SE</Option>
                <Option value="TE">TE</Option>
                <Option value="BE">BE</Option>
              </Select>
              {renderFieldError("Class")}
            </div>
            
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Roll No<RequiredField />
              </Typography>
              <Input
                id="Roll_No"
                size="lg"
                type="number"
                label="Roll No"
                value={formData.Roll_No}
                onChange={handleOnChange}
                error={!!errors.Roll_No}
              />
              {renderFieldError("Roll_No")}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Certificate Course Title<RequiredField />
              </Typography>
              <Input
                id="Certificate_Course_Title"
                size="lg"
                label="Certificate Course Title"
                value={formData.Certificate_Course_Title}
                onChange={handleOnChange}
                error={!!errors.Certificate_Course_Title}
              />
              {renderFieldError("Certificate_Course_Title")}
            </div>
            
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Organized By<RequiredField />
              </Typography>
              <Input
                id="Organized_By"
                size="lg"
                label="Organized By"
                value={formData.Organized_By}
                onChange={handleOnChange}
                error={!!errors.Organized_By}
              />
              {renderFieldError("Organized_By")}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Place<RequiredField />
              </Typography>
              <Input
                id="Place"
                size="lg"
                label="Place"
                value={formData.Place}
                onChange={handleOnChange}
                error={!!errors.Place}
              />
              {renderFieldError("Place")}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Mode of Course<RequiredField />
              </Typography>
              <Select
                id="Mode_of_Course"
                size="lg"
                label="Select Mode of Course"
                value={formData.Mode_of_Course}
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Mode_of_Course", value },
                  })
                }
                error={!!errors.Mode_of_Course}
              >
                <Option value="Online">Online</Option>
                <Option value="Offline">Offline</Option>
              </Select>
              {renderFieldError("Mode_of_Course")}
            </div>
            
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Duration in days<RequiredField />
              </Typography>
              <Input
                id="Duration"
                size="lg"
                type="number"
                label="Duration"
                value={formData.Duration}
                onChange={handleOnChange}
                error={!!errors.Duration}
                />
                {renderFieldError("Duration")}
              </div>
            </div>
  
            <div className="mb-4 flex flex-wrap -mx-4">
              <div className="w-full md:w-1/2 px-4 mb-4">
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Start Date<RequiredField />
                </Typography>
                <Input
                  id="Start_Date"
                  size="lg"
                  label="Start Date"
                  type="date"
                  value={formData.Start_Date}
                  onChange={handleOnChange}
                  error={!!errors.Start_Date}
                />
                {renderFieldError("Start_Date")}
              </div>
              
              <div className="w-full md:w-1/2 px-4 mb-4">
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  End Date<RequiredField />
                </Typography>
                <Input
                  id="End_Date"
                  size="lg"
                  label="End Date"
                  type="date"
                  value={formData.End_Date}
                  onChange={handleOnChange}
                  error={!!errors.End_Date}
                />
                {renderFieldError("End_Date")}
              </div>
            </div>
  
            <div className="mb-4 flex flex-wrap -mx-4">
              <div className="w-full">
                <div className="px-4 mb-4 flex justify-start items-center gap-4">
                  <Typography variant="h6" color="blue-gray" className="mb-3">
                    Financial support from institute in INR
                  </Typography>
                  <div className="flex gap-3">
                    <label className="mx-2">
                      <input
                        type="radio"
                        name="financialSupport"
                        value="yes"
                        checked={isFinancialSupport}
                        onChange={() => setIsFinancialSupport(true)}
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="financialSupport"
                        value="no"
                        checked={!isFinancialSupport}
                        onChange={() => setIsFinancialSupport(false)}
                      />
                      No
                    </label>
                  </div>
                </div>
                <div className="flex justify-between flex-col md:flex-row">
                  <div className="w-full md:w-1/2 px-4 mb-4">
                    <Input
                      size="lg"
                      label="Amount in INR"
                      id="Financial_support_given_by_institute_in_INR"
                      type="number"
                      value={formData.Financial_support_given_by_institute_in_INR}
                      onChange={handleOnChange}
                      disabled={!isFinancialSupport}
                      error={!!errors.Financial_support_given_by_institute_in_INR}
                    />
                    {renderFieldError("Financial_support_given_by_institute_in_INR")}
                  </div>
                  <div className="w-full md:w-1/2 px-4 mb-4">
                    <Input
                      size="lg"
                      label="Evidence Document"
                      id="Upload_Evidence"
                      type="file"
                      onChange={handleOnChange}
                      disabled={!isFinancialSupport}
                      error={!!errors.Upload_Evidence}
                    />
                    {renderFieldError("Upload_Evidence")}
                  </div>
                </div>
              </div>
            </div>
  
            <div className="mb-4 flex flex-wrap -mx-4">
              <div className="w-full md:w-1/2 px-4 mb-4">
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Award<RequiredField />
                </Typography>
                <Input
                  id="Award"
                  size="lg"
                  label="Award"
                  value={formData.Award}
                  onChange={handleOnChange}
                  error={!!errors.Award}
                />
                {renderFieldError("Award")}
              </div>
              
              <div className="w-full md:w-1/2 px-4 mb-4">
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Award Prize Money<RequiredField />
                </Typography>
                <Input
                  id="Award_Prize_Money"
                  size="lg"
                  label="Award Prize Money"
                  value={formData.Award_Prize_Money}
                  onChange={handleOnChange}
                  error={!!errors.Award_Prize_Money}
                />
                {renderFieldError("Award_Prize_Money")}
              </div>
            </div>
  
            <div className="mb-4 flex flex-wrap -mx-4">
              <div className="w-full px-4 mb-4">
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Upload Completion Certificate (Only Pdf)<RequiredField />
                </Typography>
                <Input
                  id="Upload_Certificates"
                  size="lg"
                  label=""
                  type="file"
                  onChange={handleOnChange}
                  error={!!errors.Upload_Certificates}
                  accept=".pdf"
                />
                {renderFieldError("Upload_Certificates")}
              </div>
            </div>
  
            {id ? (
            <Button type="submit" className="mt-4" fullWidth>
              Update
            </Button>
          ) : (
            <Button type="submit" className="mt-4" fullWidth>
              Submit
            </Button>
          )}
        </form>
        </Card>
      </>
    );
  }