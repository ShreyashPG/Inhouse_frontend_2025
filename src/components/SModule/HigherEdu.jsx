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

import {getRecordHigherEduByID, addRecordsHigherEdu, uploadRecordsHigherEdu, updateRecordsHigherEdu } from "./API_Routes";

export default function HigherEdu() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const [uploadedFilePaths, setUploadedFilePaths] = useState({});
  const [tableName, setTableName] = useState("");
  const [id, setId] = useState(null);

  const options = Array.from({ length: 11 }, (_, index) => index + 1);
  const [formData, setFormData] = useState({
    S_ID: null,
    Username: currentUser?.Username,
    Academic_Year: "",
    Student_Name: currentUser?.Name,
    Roll_No: null,
    Division: null,
    Department: "",
    Mobile_No: null,
    Email_ID: currentUser?.Username,
    Parent_Mobile_No: "",
    Passing_Year: "",
    Qualifying_Exam_Attempted: "",
    Upload_Proof_of_Qualifying_Exam: null,
    Upload_Score_Card_as_Evidence: null,
    Name_of_university_admitted_for_higher_studies: "",
    Name_of_enrolled_Branch_Specialization: "",
    Upload_ID_card_or_Proof_of_Admission: null,
  });

  const fetchRecord = async (tableName, table_id) => {
    try {
      if (table_id !== null) {
        const recordHigherEduURL = getRecordHigherEduByID(
          table_id,
          currentUser?.Username
        );
        const response = await axios.get(recordHigherEduURL);
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
      [id]:
        type === "file" ? (files && files.length > 0 ? files[0] : null) : value,
    });
  };

  const handleFileUpload = async (files) => {

    console.log("file as:", files);
    try {

      const queryParams = new URLSearchParams();
      // formDataForFile.append("file", file);
      queryParams.append("username", currentUser?.Username);
      queryParams.append("role", currentUser?.Role);
      queryParams.append("tableName", "student_higher_education");

      const formDataForFile = new FormData();

      const columnNames = [];
      if (formData.Upload_Proof_of_Qualifying_Exam) {
        formDataForFile.append("files", formData.Upload_Proof_of_Qualifying_Exam);
        columnNames.push("Upload_Proof_of_Qualifying_Exam");
      }
      if (formData.Upload_Score_Card_as_Evidence) {
        formDataForFile.append("files", formData.Upload_Score_Card_as_Evidence);
        columnNames.push("Upload_Score_Card_as_Evidence");
      }
      if (formData.Upload_ID_card_or_Proof_of_Admission) {
        formDataForFile.append("files", formData.Upload_ID_card_or_Proof_of_Admission);
        columnNames.push("Upload_ID_card_or_Proof_of_Admission");
      }

      queryParams.append("columnNames", columnNames.join(","));
      console.log("query = ", queryParams);

      const url = `${uploadRecordsHigherEdu}?${queryParams.toString()}`;

      const response = await axios.post(url, formDataForFile, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response?.data);
      return response?.data?.uploadResults;

    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error as needed
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
    }
  };

  //add new record
  const handleSubmit = async (e) => {

    console.log("Form data is : ", formData);
    e.preventDefault();

    const requiredFields = ["Academic_Year", "Department", "Student_Name", "Roll_No"];

    const emptyFields = requiredFields.filter(field => !formData[field]);

    if (emptyFields.length > 0) {
      const emptyFieldNames = emptyFields.join(", ");
      alert(`Please fill in all required fields: ${emptyFieldNames}`);
      return;
    }
    // Validate Roll No
    if (!(/^\d{5}$/.test(formData.Roll_No))) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Roll_No: "Roll No must be a 5-digit number."
      }));
      return;
    }

    // Validate Passing Year
    if (!(/^\d{4}$/.test(formData.Passing_Year))) {
      setErrors((prevErrors) => ({
      ...prevErrors,
      Passing_Year: "Passing Year must be a 4-digit number."
      }));
      toast.error("Passing Year must be a 4-digit number.", {
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

    // Validate Mobile No
    if (!(/^\d{10}$/.test(formData.Mobile_No))) {
      setErrors((prevErrors) => ({
      ...prevErrors,
      Mobile_No: "Mobile No must be a 10-digit number."
      }));
      toast.error("Mobile No must be a 10-digit number.", {
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

    // Validate Parent Mobile No
    if (!(/^\d{10}$/.test(formData.Parent_Mobile_No))) {
      setErrors((prevErrors) => ({
      ...prevErrors,
      Parent_Mobile_No: "Parent Mobile No must be a 10-digit number."
      }));
      toast.error("Parent Mobile No must be a 10-digit number.", {
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


    // 

    try {
      const filesToUpload = [];
      if (
        formData.Upload_Proof_of_Qualifying_Exam !== null &&
        formData.Upload_Score_Card_as_Evidence !== null &&
        formData.Upload_ID_card_or_Proof_of_Admission !== null
      ) {
        filesToUpload.push(formData.Upload_Proof_of_Qualifying_Exam);
        filesToUpload.push(formData.Upload_Score_Card_as_Evidence);
        filesToUpload.push(formData.Upload_ID_card_or_Proof_of_Admission);
      } else {
        toast.error("Please select a file for upload", {
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

    

      const requiredFieldsWithMessages = [
        { field: "Academic_Year", message: "Please select an Academic Year." },
        { field: "Department", message: "Please select a Department." },
        { field: "Student_Name", message: "Please enter the Student Name." },
        { field: "Roll_No", message: "Please enter the Roll No." },
        { field: "Mobile_No", message: "Please enter the Mobile No." },
        { field: "Division", message: "Please select a Division." },
        { field: "Parent_Mobile_No", message: "Please enter the Parent Mobile No." },
        { field: "Passing_Year", message: "Please enter the Passing Year." },
        { field: "Qualifying_Exam_Attempted", message: "Please select a Qualifying Exam Attempted." },
        { field: "Name_of_university_admitted_for_higher_studies", message: "Please enter the Name of university admitted for higher studies." },
        { field: "Name_of_enrolled_Branch_Specialization", message: "Please enter the Name of enrolled Branch Specialization." },
        { field: "Upload_Proof_of_Qualifying_Exam", message: "Please upload the Proof of Qualifying Exam." },
        { field: "Upload_Score_Card_as_Evidence", message: "Please upload the Score Card as Evidence." },
        { field: "Upload_ID_card_or_Proof_of_Admission", message: "Please upload the ID card or Proof of Admission." }
      ];

      for (const { field, message } of requiredFieldsWithMessages) {
        if (!formData[field]) {
          alert(message);
          return;
        }
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

      console.log("Final data:", formDataWithFilePath);

      // Send a POST request to the addRecordsBook API endpoint
      const res = await axios.post(addRecordsHigherEdu, formDataWithFilePath);
      console.log("Response = ", res);

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
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const filesToUpload = [];
      if (
        formData.Upload_Proof_of_Qualifying_Exam !== null &&
        formData.Upload_Score_Card_as_Evidence !== null &&
        formData.Upload_ID_card_or_Proof_of_Admission !== null
      ) {
        filesToUpload.push(formData.Upload_Proof_of_Qualifying_Exam);
        filesToUpload.push(formData.Upload_Score_Card_as_Evidence);
        filesToUpload.push(formData.Upload_ID_card_or_Proof_of_Admission);
      } else {
        toast.error("Please select a file for upload", {
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
  
      await axios.put(
        `${updateRecordsHigherEdu}?username=${currentUser?.Username}&S_ID=${id}`,
        formDataWithFilePath
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
          Higher Education
        </Typography>

        <form className="mt-8 mb-2" onSubmit={id ? handleUpdate : handleSubmit}>
          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Department <span className="text-red-500 text-sm">*</span>
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
                required
              >
                <Option value="CS">CS</Option>
                <Option value="IT">IT</Option>
                <Option value="EnTC">EnTC</Option>
                <Option value="FE">FE</Option>
              </Select>
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Academic Year of Higher Education <span className="text-red-500 text-sm">*</span>
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
                required
              >
                {generateAcademicYearOptions()}
              </Select>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Student Name <span className="text-red-500 text-sm">*</span>
              </Typography>
              <Input
                id="Student_Name"
                size="lg"
                label="Student Name"
                value={formData.Student_Name}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Roll No (Final Year) <span className="text-red-500 text-sm">*</span>
              </Typography>
              <Input
                id="Roll_No"
                size="lg"
                label="Roll No"
                type="number"
                value={formData.Roll_No}
                onChange={handleOnChange}
                required
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Mobile No <span className="text-red-500 text-sm">*</span>
              </Typography>
              <Input
                id="Mobile_No"
                size="lg"
                label="Mobile No"
                value={formData.Mobile_No}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Div <span className="text-red-500 text-sm">*</span>
              </Typography>
              <Select
                id="Division"
                label="Eg.11"
                size="lg"
                value={formData.Division}
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Division", value },
                  })
                }
                required
              >
                {options.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Parent Mobile No
              </Typography>
              <Input
                id="Parent_Mobile_No"
                size="lg"
                label="Parent Mobile No"
                value={formData.Parent_Mobile_No}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Passing Year <span className="text-red-500 text-sm">*</span>
              </Typography>
              <Input
                id="Passing_Year"
                size="lg"
                label="Passing Year"
                value={formData.Passing_Year}
                onChange={handleOnChange}
                required
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4 ">
            <div className="w-full md:w-1/2 px-4 mb-4 flex flex-col gap-1">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Qualifying Exam Attempted <span className="text-red-500 text-sm">*</span>
              </Typography>
              <Select
                id="Qualifying_Exam_Attempted"
                size="lg"
                label="Qualifying Exam Attempted"
                value={formData.Qualifying_Exam_Attempted}
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Qualifying_Exam_Attempted", value },
                  })
                }
                required
              >
                <Option value="GRE">GRE</Option>
                <Option value="GATE">GATE</Option>
                <Option value="CAT">CAT</Option>
                <Option value="TOEFL">TOEFL</Option>
                <Option value="IELTS">IELTS</Option>
                <Option value="SAT">SAT</Option>
                <Option value="CMAT">CMAT</Option>
                <Option value="MAT">MAT</Option>
                <Option value="UPSC">UPSC</Option>
                <Option value="MPSC">MPSC</Option>
              </Select>
            </div>

            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Upload Proof of Qualifying Exam (Only Pdf) <span className="text-red-500 text-sm">*</span>
              </Typography>
              <Input
                id="Upload_Proof_of_Qualifying_Exam"
                size="lg"
                type="file"
                label=""
                onChange={handleOnChange}
                required
              />
            </div>
          </div>
          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Name of university admitted for higher studies <span className="text-red-500 text-sm">*</span>
              </Typography>
              <Input
                id="Name_of_university_admitted_for_higher_studies"
                size="lg"
                type="text"
                label="Name of university admitted for higher studies"
                value={formData.Name_of_university_admitted_for_higher_studies}
                onChange={handleOnChange}
                required
              />
            </div>

            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Name of enrolled Branch Specialization <span className="text-red-500 text-sm">*</span>
              </Typography>
              <Input
                id="Name_of_enrolled_Branch_Specialization"
                size="lg"
                label="Name of enrolled Branch Specialization"
                value={formData.Name_of_enrolled_Branch_Specialization}
                onChange={handleOnChange}
                required
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Upload ID card or Proof of Admission (Only Pdf) <span className="text-red-500 text-sm">*</span>
              </Typography>
              <Input
                id="Upload_ID_card_or_Proof_of_Admission"
                size="lg"
                label=""
                type="file"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Upload Score Card as Evidence (Only Pdf) <span className="text-red-500 text-sm">*</span>
              </Typography>
              <Input
                id="Upload_Score_Card_as_Evidence"
                size="lg"
                type="file"
                label=""
                onChange={handleOnChange}
                required
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
