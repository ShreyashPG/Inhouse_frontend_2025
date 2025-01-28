import {
  Card,
  Input,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { useEffect, useState } from "react";
//+++++++++++++++++++++++++++++++++++++++++++++
import { useSelector } from "react-redux";
import axios from "axios";
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { useLocation, useNavigate } from "react-router-dom";
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getRecordsExtensionByID,updateRecordsExtension,addRecordsExtension, uploadRecordsExtension } from "./API_Routes";

export default function ExtensionActivity() {
  const { currentUser } = useSelector((state) => state.user);
  const [uploadedFilePaths, setUploadedFilePaths] = useState({});
  const [tableName, setTableName] = useState("");
  const [id, setId] = useState(null);

  // console.log('cuurentuser: ',currentUser);
  
  const fetchRecord = async (tableName, table_id) => {
    try {
      if (table_id !== null) {
        const recordExtentionURL = getRecordsExtensionByID(
          table_id,
          currentUser?.Username
        );
        const response = await axios.get(recordExtentionURL);
        const recordData = response.data.data[0];
        
        setFormData({
          ...recordData,
          T_ID: table_id,
          Start_Date: recordData.Start_Date ? recordData.Start_Date.split('T')[0] : '',
          End_Date: recordData.End_Date ? recordData.End_Date.split('T')[0] : '',
        });
        
        // Set file names for display
        if (recordData.Upload_List_of_Students) {
          setUploadedFilePaths(prev => ({...prev, Upload_List_of_Students: recordData.Upload_List_of_Students}));
        }
        if (recordData.Upload_Report) {
          setUploadedFilePaths(prev => ({...prev, Upload_Report: recordData.Upload_Report}));
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching record data");
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
  }, [location, currentUser]);

 

  //++++++++++++++++++++++++++++++++++++++
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    T_ID: null,
    Name: currentUser?.Name,
    Username: currentUser?.Username,
    Dept_Name: "",
    Title: "",
    Start_Date: null,
    End_Date: null,
    Title_of_extension_activity: "",
    Scheme_Name: "",
    Role: "",
    Purpose: "",
    NoOf_Student_Participants: "",
    NoOf_Faculty_Participants: "",
    PSOs_Attained: "",
    Place: "",
    Upload_List_of_Students: null,
    Upload_Report: null,
  });
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData(prevData => ({
      ...prevData,
      [name]: type === "file" ? (files && files.length > 0 ? files[0] : null) : value,
    }));

    if (type === "file" && files && files.length > 0) {
      setUploadedFilePaths(prev => ({...prev, [name]: files[0].name}));
    }
  };

  const handleFileUpload = async (files) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("username", currentUser?.Username);
      queryParams.append("role", currentUser?.Role);
      queryParams.append("tableName", "extension_activity");
      // queryParams.append("columnNames", "Upload_Evidence,Upload_Paper,Upload_DOA");

      let formDataForUpload = new FormData();
      const columnNames = [];
      // Append files under the 'files' field name as expected by the server
      if (formData.Upload_List_of_Students) {
        formDataForUpload.append("files", formData.Upload_List_of_Students);
        columnNames.push("Upload_List_of_Students");
      }
      if (formData.Upload_Report) {
        formDataForUpload.append("files", formData.Upload_Report);
        columnNames.push("Upload_Report");
      }


      // Append column names to the query parameters
      queryParams.append("columnNames", columnNames.join(","));
      console.log('query: ', queryParams);
      const url = `${uploadRecordsExtension}?${queryParams.toString()}`;
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
    console.log(formData);
    if (formData.Upload_List_of_Students === null ||
      formData.Upload_Report === null) {
      toast.error('Select file for upload', {
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

      if (formData.Upload_List_of_Students !== null) {
        filesToUpload.push(formData.Upload_List_of_Students);
      }
      if (formData.Upload_Report !== null) {
        filesToUpload.push(formData.Upload_Report);
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
      await axios.post(addRecordsExtension, formDataWithFilePath);

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

   //+++++++++++++++++++++++++++++++++++++++++++++++++

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
        `${updateRecordsExtension}?username=${currentUser?.Username}&T_ID=${id}`,
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
  //++++++++++++++++++++++++++++++++++++
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
          Extension Activity
        </Typography>

        <form className="mt-8 mb-2" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Name of the Dept
              </Typography>
              <Select
                size="lg"
                name="Dept_Name"
                label="Department"
                value={formData.Dept_Name}
                onChange={(value) =>
                  handleChange({
                    target: { name: "Dept_Name", value },
                  })
                }
              >
                <Option value="CS">CS</Option>
                <Option value="IT">IT</Option>
                <Option value="EnTC">EnTC</Option>
                <Option value="FE">FE</Option>
              </Select>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Title
              </Typography>
              <Input
                size="lg"
                name="Title"
                type="text"
                value={formData.Title}
                label="Title"
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Title of extension activity
              </Typography>
              <Input
                size="lg"
                name="Title_of_extension_activity"
                type="text"
                value={formData.Title_of_extension_activity}
                label="Title of extension activity"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Start Date
              </Typography>
              <Input
                size="lg"
                name="Start_Date"
                value={formData.Start_Date}
                label="Start Date"
                type="date"
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                End Date
              </Typography>
              <Input
                size="lg"
                name="End_Date"
                value={formData.End_Date}
                label="End Date"
                type="date"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Name of the scheme
              </Typography>
              <Input
                size="lg"
                name="Scheme_Name"
                type="text"
                value={formData.Scheme_Name}
                label="Name of the scheme"
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Role
              </Typography>
              <Input
                size="lg"
                name="Role"
                value={formData.Role}
                label="Role"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full  px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Purpose of activity
              </Typography>
              <Input
                size="lg"
                name="Purpose"
                value={formData.Purpose}
                label="Purpose of activity"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                No. of student participant
              </Typography>
              <Input
                size="lg"
                name="NoOf_Student_Participants"
                value={formData.NoOf_Student_Participants}
                label="No. of student participant"
                type="number"
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                List of Students
              </Typography>
              <Input
                size="lg"
                name="Upload_List_of_Students"
                type="file"
                label="List of Students"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                No. of faculty participant/Contributed
              </Typography>
              <Input
                size="lg"
                name="NoOf_Faculty_Participants"
                value={formData.NoOf_Faculty_Participants}
                label="No. of faculty participant/Contributed"
                type="number"
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                POs, PSOs attained through this activity
              </Typography>
              <Input
                size="lg"
                name="PSOs_Attained"
                value={formData.PSOs_Attained}
                label="POs, PSOs attained through this activity"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Place of the extension activity
              </Typography>
              <Input
                size="lg"
                name="Place"
                value={formData.Place}
                label="Place of the extension activity"
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Final Report
              </Typography>
              <Input
                size="lg"
                name="Upload_Report"
                type="file"
                label="Report"
                onChange={handleChange}
              />
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
