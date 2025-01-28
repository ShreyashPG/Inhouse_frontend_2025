
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
    addRecordsReviewer,
    getRecordReviewerByID,
    updateRecordsReviewer,
    uploadRecordsReviewer,
} from "./API_Routes";

export default function Reviewer() {
    const { currentUser } = useSelector((state) => state.user);
    const [uploadedFilePaths, setUploadedFilePaths] = useState({});
    const location = useLocation();
    const [tableName, setTableName] = useState("");
    const [id, setId] = useState(null);

    const fetchRecord = async (tableName, table_id) => {
        try {
            if (table_id !== null) {
                const recordReviwerURL = getRecordReviewerByID(
                    table_id,
                    currentUser?.Username
                );
                const response = await axios.get(recordReviwerURL);
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
        Event: "",
        Name_of_Event: "",
        Venue_of_Event: "",
        Date: "",
        Proof_Invitation_Letter: null,
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
            queryParams.append("tableName", "reviewer");

            let formDataForUpload = new FormData();
            const columnNames = [];
            if (formData.Proof_Invitation_Letter) {
                formDataForUpload.append("files", formData.Proof_Invitation_Letter);
                columnNames.push("Proof_Invitation_Letter");
            }

            queryParams.append("columnNames", columnNames.join(","));
            const url = `${uploadRecordsReviewer}?${queryParams.toString()}`;
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
        if (formData.Proof_Invitation_Letter === null) {
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

            if (formData.Proof_Invitation_Letter !== null) {
                filesToUpload.push(formData.Proof_Invitation_Letter);
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

            await axios.post(addRecordsReviewer, formDataWithFilePath);

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

        if (formData.Proof_Invitation_Letter === null) {
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

            if (formData.Proof_Invitation_Letter !== null) {
                filesToUpload.push(formData.Proof_Invitation_Letter);
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
                `${updateRecordsReviewer}?username=${currentUser?.Username}&T_ID=${id}`,
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
                    Reviewer
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
                                required
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
                                Event
                            </Typography>
                            <Select
                                id="Event"
                                size="lg"
                                label="Event"
                                value={formData.Event}
                                onChange={(value) =>
                                    handleOnChange({
                                        target: { id: "Event", value },
                                    })
                                }
                                required
                            >
                                <Option value="Journal/Conference/Hackathon Judge">Journal/Conference/Hackathon Judge</Option>
                                <Option value="PhD Reviewer">PhD Reviewer</Option>
                                <Option value="ME Project Reviewer">ME Project Reviewer</Option>
                                <Option value="Seminar Reviewers">Seminar Reviewers</Option>
                                <Option value="Poster Presentation Reviewer">Poster Presentation Reviewer</Option>
                                <Option value="Others">Others</Option>
                            </Select>
                        </div>
                    </div>
                    <div className="mb-4 flex flex-wrap -mx-4">
                        <div className="w-full md:w-1/2 px-4 mb-4">
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                Name of Event
                            </Typography>
                            <Input
                                id="Name_of_Event"
                                size="lg"
                                type="text"
                                label="Name of Event"
                                value={formData.Name_of_Event}
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-4 mb-4">
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                Venue of Event
                            </Typography>
                            <Input
                                id="Venue_of_Event"
                                size="lg"
                                type="text"
                                label="Venue of Event"
                                value={formData.Venue_of_Event}
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4 flex flex-wrap -mx-4">
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
                                Proof/Invitation Letter/Conduction Letter/Appreciation Letter (Pdf Only)
                            </Typography>
                            <Input
                                id="Proof_Invitation_Letter"
                                size="lg"
                                type="file"
                                label="Proof/Invitation Letter"
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