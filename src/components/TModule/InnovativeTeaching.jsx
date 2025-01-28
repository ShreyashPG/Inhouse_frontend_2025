import { useEffect, useState } from "react";
import {
  Card,
  Select,
  Option,
  Input,
  Button,
  Typography,
  Checkbox,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  addRecordsInnovativeTeaching,
  getRecordInnovativeTeachingByID,
  updateRecordsInnovativeTeaching,
  uploadRecordsInnovativeTeaching,
} from "./API_Routes";

export default function InnovativeTeaching() {
  const { currentUser } = useSelector((state) => state.user);
  const [uploadedFilePaths, setUploadedFilePaths] = useState({});
  const location = useLocation();
  const [tableName, setTableName] = useState("");
  const [id, setId] = useState(null);

  const fetchRecord = async (tableName, table_id) => {
    try {
      if (table_id !== null) {
        const recordBookURL = getRecordInnovativeTeachingByID(
          table_id,
          currentUser?.Username
        );
        const response = await axios.get(recordBookURL);
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
  }, [location]);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    T_ID: null,
    Name: currentUser?.Name || "",
    Username: currentUser?.Username || "",
    Staff_Name: "",
    Activity_Performed_Date: "",
    Activity_Performed: [],
    ICT_Tools_Use: "",
    Upload_Activity_Report: null,
  });

  const handleFileUpload = async (files) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("username", currentUser?.Username);
      queryParams.append("role", currentUser?.Role);
      queryParams.append("tableName", "innovative_teaching");

      let formDataForUpload = new FormData();
      const columnNames = [];
      if (formData.Upload_Activity_Report) {
        formDataForUpload.append("files", formData.Upload_Activity_Report);
        columnNames.push("Upload_Activity_Report");
      }

      queryParams.append("columnNames", columnNames.join(","));
      const url = `${uploadRecordsInnovativeTeaching}?${queryParams.toString()}`;
      const response = await axios.post(url, formDataForUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response?.data?.uploadResults;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error?.response?.data?.message, {
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
  };

  const handleOnChange = (e) => {
    const { id, value, type, files } = e.target;

    setFormData({
      ...formData,
      [id]:
        type === "file" ? (files && files.length > 0 ? files[0] : null) : value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setFormData((prevFormData) => {
      const updatedActivities = checked
        ? [...prevFormData.Activity_Performed, id]
        : prevFormData.Activity_Performed.filter((activity) => activity !== id);
      return { ...prevFormData, Activity_Performed: updatedActivities };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.Upload_Activity_Report === null) {
      toast.error("Select a file for upload.", {
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
      if (formData.Upload_Activity_Report !== null) {
        filesToUpload.push(formData.Upload_Activity_Report);
      }
  
      const uploadResults = await handleFileUpload(filesToUpload);
      const updatedUploadedFilePaths = { ...uploadedFilePaths };
      uploadResults.forEach((result) => {
        updatedUploadedFilePaths[result.columnName] = result.filePath;
      });
      setUploadedFilePaths(updatedUploadedFilePaths);
  
      // Prepare formData with Activity_Performed as a comma-separated string
      const formDataWithFilePath = {
        ...formData,
        ...updatedUploadedFilePaths,
        Activity_Performed: formData.Activity_Performed.join(", "), // Convert array to string
      };
  
      console.log('formData::', formDataWithFilePath);
      await axios.post(addRecordsInnovativeTeaching, formDataWithFilePath);
  
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
  
      navigate("/t/data");
    } catch (error) {
      console.error("File upload error:", error);
      toast.error(error?.response?.data?.message, {
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
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("formData: ", formData);
    if (formData.Upload_Activity_Report === null) {
      toast.error("Select a file for upload.", {
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
      if (formData.Upload_Activity_Report !== null) {
        filesToUpload.push(formData.Upload_Activity_Report);
      }
  
      const uploadResults = await handleFileUpload(filesToUpload);
      const updatedUploadedFilePaths = { ...uploadedFilePaths };
      uploadResults.forEach((result) => {
        updatedUploadedFilePaths[result.columnName] = result.filePath;
      });
      setUploadedFilePaths(updatedUploadedFilePaths);
  
      // Prepare formData with Activity_Performed as a comma-separated string
      const formDataWithFilePath = {
        ...formData,
        ...updatedUploadedFilePaths,
        Activity_Performed: formData.Activity_Performed.join(", "), // Convert array to string
      };
  
      await axios.put(
        `${updateRecordsInnovativeTeaching}?username=${currentUser?.Username}&T_ID=${id}`,
        formDataWithFilePath
      );
  
      toast.success("Record updated Successfully", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  
      navigate("/t/data");
    } catch (error) {
      console.error("File upload error:", error);
      toast.error(error?.response?.data?.message, {
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
  };
  
  return (
    <>
      <Card
        color="transparent"
        shadow={false}
        className="border border-gray-300 w-85 mx-auto p-2 my-2 rounded-md overflow-x-hidden"
      >
        <Typography
          variant="h4"
          color="blue-gray"
          className="mx-auto underline underline-offset-2"
        >
          Innovative Teaching
        </Typography>

        <form className="mt-8 mb-2" onSubmit={id ? handleUpdate : handleSubmit}>
          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Staff Name
              </Typography>
              <Select
                id="Staff_Name"
                size="lg"
                label="Staff Name"
                value={formData.Staff_Name}
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Staff_Name", value },
                  })
                }
              >
                {[
                  "Dr. A. S. Ghotkar",
                  "Dr. Emmanual M.",
                  "Dr. A. M. Bagade",
                  "Dr. S. C. Dharmadhikari",
                  "Mr. S. S. Pande",
                  "Dr. Shyam Deshmukh",
                  "Mr. T. A. Rane",
                  "Mr. M. R. Khodaskar",
                  "Mrs. K. Y. Digholkar",
                  "Mr. V. R. Jaiswal",
                  "Mrs. R. A. Karnawat",
                  "Mr. R. B. Murumkar",
                  "Mr. N. V. Buradkar",
                  "Dr. J. B. Jagdale",
                  "Mr. S. D. Shelke",
                  "Mr. S. R. Warhade",
                  "Dr. Kavita Sultanpure",
                  "Dr. R. V. Kulkarni",
                  "Mrs. S. A. Jakhete",
                  "Mr. A. G. Dhamankar",
                  "Mr. J. K. Kamble",
                  "Mr. H. J. Joshi",
                  "Mrs. U. A. Joglekar",
                  "Mr. A. C. Karve",
                  "Mrs. A. V. Yenkikar",
                  "Mr. V. R. Tribhuwan",
                  "Dr. A. A. Kadam",
                  "Mrs. P. S. Shinde",
                  "Mrs. J. H. Jadhav",
                  "Mrs. D. S. Sapkal",
                  "Mrs. S. R. Hirey",
                  "Mrs. A. S. Kadam",
                  "Mr. G. S. Pise",
                  "Mr. S. S. Shinde",
                  "Ms. N. N Shinde",
                  "Mrs. R. D. Kapadi",
                  "Mrs. Amruta Awati",
                  "Mrs. D. P. Salapurkar",
                ].map((name) => (
                  <Option key={name} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Activity Performed Date
              </Typography>
              <Input
                id="Activity_Performed_Date"
                size="lg"
                type="date"
                value={formData.Activity_Performed_Date}
                onChange={handleOnChange}
              />
            </div>
          </div>
          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Activity Performed
              </Typography>
              {[
                "Simulator",
                "BlogWebsite",
                "Case Study Preparation/Development Website Using LMS",
                "Flipped Classroom",
                "Quiz",
                "Mindmapping",
                "Project Based Learning",
                "Role Play",
                "Brainstorming",
                "Design Contest",
                "Video Lecture Creation",
                "QR Code",
              ].map((activity) => (
                <Checkbox
                  key={activity}
                  id={activity}
                  label={activity}
                  checked={formData.Activity_Performed.includes(activity)}
                  onChange={handleCheckboxChange}
                />
              ))}
              <Checkbox
                id="Other"
                label="Other"
                checked={formData.Activity_Performed.includes("Other")}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                ICT Tools Used
              </Typography>
              <Select
                id="ICT_Tools_Use"
                size="lg"
                label="ICT Tools Use"
                value={formData.ICT_Tools_Use}
                onChange={(value) => {
                  handleOnChange({
                    target: { id: "ICT_Tools_Use", value },
                  });
                }}
                className="mb-4"
              >
                {[
                  "Drawing and graphics programs",
                  "Web creation and design",
                  "Digital video",
                  "Wikis",
                  "Blogs",
                  "Animation",
                  "Trello",
                  "ICT Tools for Quizzing/Testing/Gaming",
                  "ICT Tool for Presentation",
                  "ICT Tools for Creative Creations",
                  "ICT Tools for Online Collaboration",
                  "ICT Tools for Videos",
                  "ICT Tools for Brainstorm",
                  "ICT Tools for Studying",
                  "ICT Tool for Lesson Series",
                  "Online Coding Websites e.g. DataCamp, HackerRank, Coderbyte",
                  "ICT Tools for Teaching Mathematics",
                  "Other", // Added Other option here
                ].map((tool) => (
                  <Option key={tool} value={tool}>
                    {tool}
                  </Option>
                ))}
              </Select>
              {/* {formData.ICT_Tools_Use === "Other" && ( // Conditionally render the input
                <Input
                  id="Other_ICT_Tool"
                  size="lg"
                  type="text"
                  label="Please specify"
                  value={formData.Other_ICT_Tool}
                  onChange={(e) =>
                    setFormData({ ...formData, Other_ICT_Tool: e.target.value })
                  }
                />
              )} */}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Upload Your Activity Report Here Duly Signed Copy (PDF Only)
              </Typography>
              <Input
                id="Upload_Activity_Report"
                size="lg"
                type="file"
                label="Upload Activity Report"
                onChange={handleOnChange}
                required={true}
              />
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