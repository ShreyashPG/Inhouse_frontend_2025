//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { useEffect, useState } from "react";
//++++++++++++++++++++++++++++++++++++++++++++++
import {
  Card,
  Input,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import axios from "axios";
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { useLocation, useNavigate } from "react-router-dom";
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getRecordsProfessionalByID,
  updateRecordsProfessional,
  addRecordsProfessional,
  uploadRecordsProfessional,
} from "./API_Routes";

export default function ProfessionalAffiliations() {
  const { currentUser } = useSelector((state) => state.user);
  const [isFinancialSupport, setIsFinancialSupport] = useState(false);
  const [uploadedFilePaths, setUploadedFilePaths] = useState({});
  const [tableName, setTableName] = useState("");
  const [id, setId] = useState(null);

  // console.log('cuurentuser: ',currentUser);
  const fetchRecord = async (tableName, table_id) => {
    try {
      console.log("t id: ", table_id);
      console.log("id: ", id);
      if (table_id !== null) {
        const recordProfessionalURL = getRecordsProfessionalByID(
          table_id,
          currentUser?.Username
        );
        console.log("in Professional: ", recordProfessionalURL);
        const response = await axios.get(recordProfessionalURL);
        console.log("record response in Professional: ", response.data.data[0]);
        setFormData({
          ...response.data.data[0],
          T_ID: table_id  // Ensure T_ID is set
        });
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
    Name: currentUser?.Name,
    Username: currentUser?.Username,
    Professional_Affiliation: "",
    Membership_Number_ID: "",
    Finance_Support_By_PICT: "",
    Upload_Membership_Evidence: null,
    Upload_Evidence: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "file" ? (files && files.length > 0 ? files[0] : null) : value,
    });
  };

  const handleFileUpload = async (files) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("username", currentUser?.Username);
      queryParams.append("role", currentUser?.Role);
      queryParams.append("tableName", "professional_affiliation");

      let formDataForUpload = new FormData();
      const columnNames = [];
      // Append files under the 'files' field name as expected by the server
      if (formData.Upload_Membership_Evidence) {
        formDataForUpload.append("files", formData.Upload_Membership_Evidence);
        columnNames.push("Upload_Membership_Evidence");
      }
      if (formData.Upload_Evidence) {
        formDataForUpload.append("files", formData.Upload_Evidence);
        columnNames.push("Upload_Evidence");
      }


      // Append column names to the query parameters
      queryParams.append("columnNames", columnNames.join(","));
      console.log('query: ', queryParams);
      const url = `${uploadRecordsProfessional}?${queryParams.toString()}`;
      console.log("formdata", formDataForUpload)
      const response = await axios.post(url, formDataForUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response?.data?.uploadResults);
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
      // Handle error as needed
    }
  };

  //add new record
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check for Membership Evidence document
    if (formData.Upload_Membership_Evidence === null) {
      toast.error('Select file for membership evidence upload', {
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
  
    // Check for Financial Support Evidence document
    if (isFinancialSupport && formData.Upload_Evidence === null) {
      toast.error('Upload evidence document for financial support', {
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
  
      // Add files to upload array
      if (formData.Upload_Membership_Evidence !== null) {
        filesToUpload.push(formData.Upload_Membership_Evidence);
      }
      if (isFinancialSupport && formData.Upload_Evidence !== null) {
        filesToUpload.push(formData.Upload_Evidence);
      }
  
      // If file upload is successful, continue with the form submission
      const uploadResults = await handleFileUpload(filesToUpload);
  
      // Store the paths of uploaded files in the uploadedFilePaths object
      const updatedUploadedFilePaths = { ...uploadedFilePaths };
      uploadResults.forEach((result) => {
        updatedUploadedFilePaths[result.columnName] = result.filePath;
      });
      setUploadedFilePaths(updatedUploadedFilePaths);
  
      // Merge uploaded file paths with existing formData
      const formDataWithFilePath = {
        ...formData,
        ...updatedUploadedFilePaths,
      };
      console.log("Final data:", formDataWithFilePath);
  
      // Send a POST request to the addRecordsBook API endpoint
      await axios.post(addRecordsProfessional, formDataWithFilePath);
  
      // Display a success toast
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
  
      // Navigate to "/t/data" after successful submission
      navigate("/t/data");
    } catch (error) {
      // Handle file upload error
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

    console.log("update data:", formData);

    if (formData.Upload_Paper === null) {
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

      if (formData.Upload_Paper !== null) {
        filesToUpload.push(formData.Upload_Paper);
      }

      // If file upload is successful, continue with the form submission
      const uploadResults = await handleFileUpload(filesToUpload);

      // Store the paths of uploaded files in the uploadedFilePaths object
      const updatedUploadedFilePaths = { ...uploadedFilePaths };
      uploadResults.forEach((result) => {
        updatedUploadedFilePaths[result.columnName] = result.filePath;
      });
      setUploadedFilePaths(updatedUploadedFilePaths);

      // Merge uploaded file paths with existing formData
      const formDataWithFilePath = {
        ...formData,
        ...updatedUploadedFilePaths,
      };
      console.log("Final data with file paths:", formDataWithFilePath);

      // Send a PUT request to the updateRecordsResearch API endpoint
      await axios.put(
        `${updateRecordsProfessional}?username=${currentUser?.Username}&T_ID=${id}`,
        formDataWithFilePath
      );

      // Display a success toast
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

      // Navigate to "/t/data" after successful submission
      navigate("/t/data");
    } catch (error) {
      // Handle file upload error
      console.error("File upload error:", error);

      // Display an error toast
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
          Professional Affiliations
        </Typography>

        <div className="mb-4 flex flex-wrap -mx-4">
          <div className="w-full px-4 mb-4">
            <Typography variant="h6" color="blue-gray" className="mb-3">
              Professional Affiliation
            </Typography>
            <Select
              size="lg"
              name="Professional_Affiliation"
              value={formData.Professional_Affiliation}
              label="Select Affiliation"
              onChange={(value) =>
                handleChange({
                  target: { name: "Professional_Affiliation", value },
                })
              }
            >
              <Option value="IEEE">IEEE</Option>
              <Option value="CSI">CSI</Option>
              <Option value="ACM">ACM</Option>
              <Option value="ITE">ITE</Option>
              <Option value="ISTE">ISTE</Option>
            </Select>
          </div>
        </div>

        <form className="mt-8 mb-2" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Membership Number/ID
              </Typography>
              <Input
                size="lg"
                name="Membership_Number_ID"
                value={formData.Membership_Number_ID}
                type="text"
                label="Membership Number/ID"
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Membership Evidence document
              </Typography>
              <Input
                size="lg"
                name="Upload_Membership_Evidence"
                type="file"
                label="Membership Evidence"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4 ">
            <div className="w-full">
              <div className="px-4 mb-4 flex gap-40 ">
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Financial support from institute in INR
                </Typography>
                <div className="flex gap-3 ">
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
              <div className="flex justify-between">
                <div className="w-full md:w-1/2 px-4 mb-4">
                  <Input
                    size="lg"
                    label="Amount in INR"
                    name="Finance_Support_By_PICT"
                    type="number"
                    value={formData.Finance_Support_By_PICT}
                    onChange={handleChange}
                    disabled={!isFinancialSupport}
                  />
                </div>
                <div className="w-full md:w-1/2 px-4 mb-4 flex gap-4">
                  <Input
                    size="lg"
                    label="Evidence Document"
                    name="Upload_Evidence"
                    type="file"
                    onChange={handleChange}
                    disabled={!isFinancialSupport}
                  />
                </div>
              </div>
            </div>
          </div>
          {id ? (
            <Button onClick={handleUpdate} className="mt-4" fullWidth>
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
