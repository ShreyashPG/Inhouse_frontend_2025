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
    addRecordsExaminationWork,
    getRecordExaminationWorkByID,
    updateRecordsExaminationWork,
    uploadRecordsExaminationWork,
} from "./API_Routes";

export default function ExaminationWork() {
    const { currentUser } = useSelector((state) => state.user);
    const [uploadedFilePaths, setUploadedFilePaths] = useState({});
    const location = useLocation();
    const [tableName, setTableName] = useState("");
    const [id, setId] = useState(null);

    const fetchRecord = async (tableName, table_id) => {
        try {
            if (table_id !== null) {
                const recordExaminationWorkURL = getRecordExaminationWorkByID(
                    table_id,
                    currentUser?.Username
                );
                const response = await axios.get(recordExaminationWorkURL);
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
        name_of_staff: "",
        Department: "",
        Type_of_Activity: "",
        Year: "",
        College_University: "",
        Subject: "",
        Date: "",
        Proof_Conduction_Letter: null,
    });

    const currentYear = new Date().getFullYear();

    const years = Array.from(
        { length: currentYear - 1999 },
        (_, index) => currentYear - index
    );

    const handleFileUpload = async (files) => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append("username", currentUser?.Username);
            queryParams.append("role", currentUser?.Role);
            queryParams.append("tableName", "examination_work");

            let formDataForUpload = new FormData();
            const columnNames = [];
            if (formData.Proof_Conduction_Letter) {
                formDataForUpload.append("files", formData.Proof_Conduction_Letter);
                columnNames.push("Proof_Conduction_Letter");
            }

            queryParams.append("columnNames", columnNames.join(","));
            const url = `${uploadRecordsExaminationWork}?${queryParams.toString()}`;
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.Proof_Conduction_Letter === null) {
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

            if (formData.Proof_Conduction_Letter !== null) {
                filesToUpload.push(formData.Proof_Conduction_Letter);
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

            await axios.post(addRecordsExaminationWork, formDataWithFilePath);

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

        if (formData.Proof_Conduction_Letter === null) {
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

            if (formData.Proof_Conduction_Letter !== null) {
                filesToUpload.push(formData.Proof_Conduction_Letter);
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
                `${updateRecordsExaminationWork}?username=${currentUser?.Username}&T_ID=${id}`,
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
                    Examination Work
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
                        <div className="w-full px-4 mb-4">
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                Department
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
                                
                            >
                                <Option value="CS">CS</Option>
                                <Option value="IT">IT</Option>
                                <Option value="EnTC">EnTC</Option>
                                <Option value="FE">FE</Option>
                            </Select>
                        </div>
                    </div>
                    <div className="mb-4 flex flex-wrap -mx-4">
                        <div className="w-full px-4 mb-4">
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                Type of Activity
                            </Typography>
                            <Select
                                id="Type_of_Activity"
                                size="lg"
                                label="Type of Activity"
                                value={formData.Type_of_Activity}
                                onChange={(value) =>
                                    handleOnChange({
                                        target: { id: "Type_of_Activity", value },
                                    })
                                }
                                
                            >
                                <Option value="Paper Setting">Paper Setting</Option>
                                <Option value="Practical Exam">Practical Exam</Option>
                                <Option value="Paper Checking">Paper Checking</Option>
                            </Select>
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
                                color="light-gray"
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
                                Name of the College/University
                            </Typography>
                            <Input
                                id="College_University"
                                size="lg"
                                type="text"
                                label="Name of the College/University"
                                value={formData.College_University}
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4 flex flex-wrap -mx-4">
                        <div className="w-full md:w-1/2 px-4 mb-4">
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                Subject
                            </Typography>
                            <Input
                                id="Subject"
                                size="lg"
                                type="text"
                                label="Subject"
                                value={formData.Subject}
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-4 mb-4">
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                Date
                            </Typography>
                            <Input
                                id="Date"
                                size="lg"
                                type="date"
                                label="Date"
                                value={formData.Date}
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4 flex flex-wrap -mx-4">
                        <div className="w-full px-4 mb-4">
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                Proof/Conduction Letter (Pdf Only)
                            </Typography>
                            <Input
                                id="Proof_Conduction_Letter"
                                size="lg"
                                type="file"
                                label="Proof/Conduction Letter"
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