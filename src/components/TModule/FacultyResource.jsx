//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { useEffect, useState } from "react";
//+++++++++++++++++++++++++++++++++++++++++++++++++
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
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getRecordsResourceByID,updateRecordsResource,addRecordsResource, uploadRecordsResource } from "./API_Routes";

export default function FacultyResource() {
  const { currentUser } = useSelector((state) => state.user);
  const [tableName, setTableName] = useState("");
  const [id, setId] = useState(null);

  // console.log('cuurentuser: ',currentUser);
  const fetchRecord = async (tableName, table_id) => {
    try {
      console.log("t id: ", table_id);
      console.log("id: ", id);
      if (table_id !== null) {
        const recordResourceURL = getRecordsResourceByID(
          table_id,
          currentUser?.Username
        );
        console.log("in resource: ", recordResourceURL);
        const response = await axios.get(recordResourceURL);
        console.log("record response in resource: ", response.data.data[0]);
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
    Dept_Name: "",
    FDP_Workshop_Name: "",
    Level: "",
    Topic: "",
    Organizer: "",
    Date: null,
    Upload_Certificate: null,
  });
  const [uploadedFilePaths, setUploadedFilePaths] = useState({});

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };
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
      queryParams.append("tableName", "resource_person");

      let formDataForUpload = new FormData();
      const columnNames = [];
      // Append files under the 'files' field name as expected by the server
      if (formData.Upload_Certificate) {
        formDataForUpload.append("files", formData.Upload_Certificate);
        columnNames.push("Upload_Certificate");
      }


      // Append column names to the query parameters
      queryParams.append("columnNames", columnNames.join(","));
      console.log('query: ', queryParams);
      const url = `${uploadRecordsResource}?${queryParams.toString()}`;
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
    if (formData.Upload_Certificate === null) {
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

      if (formData.Upload_Certificate !== null) {
        filesToUpload.push(formData.Upload_Certificate);
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

      // Send a POST request to the addRecordsBook API endpoint
      await axios.post(addRecordsResource, formDataWithFilePath);

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

  const handleUpdate = async (e) => {
    e.preventDefault();

    console.log("update data:", formData);

    if (formData.Upload_Certificate === null) {
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

      if (formData.Upload_Certificate !== null) {
        filesToUpload.push(formData.Upload_Certificate);
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
        `${updateRecordsResource}?username=${currentUser?.Username}&T_ID=${id}`,
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
          Faculty as Resource Person
        </Typography>

        <form className="mt-8 mb-2" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Name Of the Department
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
                Type of event
              </Typography>
              <Select
                size="lg"
                name="eventType"
                value={formData.FDP_Workshop_Name}
                label="Select Type"
                onChange={(value) =>
                  handleChange({
                    target: { name: "FDP_Workshop_Name", value },
                  })
                }
              >
                <Option value="FDP">FDP</Option>
                <Option value="Workshop">Workshop</Option>
                <Option value="Guest Expert Lecture">
                  Guest Expert Lecture
                </Option>
                <Option value="Webinar">Webinar</Option>
                <Option value="Conducted Lecture">Conducted Lecture</Option>
                <Option value="Video Conference">Video Conference</Option>
                <Option value="Others">Others</Option>
              </Select>
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Level
              </Typography>
              <Select
                size="lg"
                name="Level"
                value={formData.Level}
                label="Level"
                onChange={(value) =>
                  handleChange({
                    target: {
                      name: "Level",
                      value,
                    },
                  })
                }
              // onChange={handleOnChange}
              >
                <Option value="International">International</Option>
                <Option value="National">National</Option>
                <Option value="State">State</Option>
                <Option value="University">University</Option>
                <Option value="College">College</Option>
                <Option value="Department">Department</Option>
              </Select>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Topic
              </Typography>
              <Input
                size="lg"
                name="Topic"
                value={formData.Topic}
                label="Topic"
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Organizer
              </Typography>
              <Input
                size="lg"
                name="Organizer"
                value={formData.Organizer}
                label="Organizer"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Date (DD-MM-YYYY)
              </Typography>
              <Input
                size="lg"
                name="Date"
                value={formData.Date}
                label="Date"
                type="date"
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Upload Certificate (Only Pdf)
              </Typography>
              <Input
                name="Upload_Certificate"
                label="Upload certificate"
                size="lg"
                type="file"
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
