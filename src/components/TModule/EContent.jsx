import { useEffect, useState } from "react";
import {
  Card,
  Select,
  Option,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  addRecordsEContent,
  getRecordEContentByID,
  updateRecordsEContent,
} from "./API_Routes";

export default function EContent() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [tableName, setTableName] = useState("");
  const [id, setId] = useState(null);

  const [formData, setFormData] = useState({
    T_ID: null,
    Name: currentUser?.Name || "",
    Username: currentUser?.Username || "",
    name_of_staff: "",
    Year: "",
    Course: "",
    Link: ""
  });

  const fetchRecord = async (tableName, table_id) => {
    try {
      if (table_id !== null) {
        const recordEContentURL = getRecordEContentByID(
          table_id,
          currentUser?.Username
        );
        const response = await axios.get(recordEContentURL);
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

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, index) => currentYear - index
  );

  const handleOnChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields are filled (excluding Name and Username which are handled automatically)
    const requiredFields = ['name_of_staff', 'Year', 'Course', 'Link'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`, {
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
      // Ensure Name and Username are included in submission
      const submitData = {
        ...formData,
        Name: currentUser?.Name,
        Username: currentUser?.Username
      };
      
      await axios.post(addRecordsEContent, submitData);

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
        `${updateRecordsEContent}?username=${currentUser?.Username}&T_ID=${id}`,
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

      navigate("/t/data");
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
        className="border border-gray-300 w-85 mx-auto p-2 my-2 rounded-md overflow-x-hidden"
      >
        <Typography
          variant="h4"
          color="blue-gray"
          className="mx-auto underline underline-offset-2"
        >
          E-Content Details
        </Typography>

        <form className="mt-8 mb-2" onSubmit={id ? handleUpdate : handleSubmit}>
          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Name of Staff
              </Typography>
              <Input
                id="name_of_staff"
                size="lg"
                label="Enter staff name"
                value={formData.name_of_staff}
                onChange={handleOnChange}
                required
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Year
              </Typography>
              <Select
                id="Year"
                size="lg"
                label="Select Year"
                value={formData.Year}
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Year", value },
                  })
                }
                

              >
                {years.map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Course
              </Typography>
              <Input
                id="Course"
                size="lg"
                label="Enter course name"
                value={formData.Course}
                onChange={handleOnChange}
                required
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Link
              </Typography>
              <Input
                id="Link"
                size="lg"
                label="Enter content link"
                value={formData.Link}
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
