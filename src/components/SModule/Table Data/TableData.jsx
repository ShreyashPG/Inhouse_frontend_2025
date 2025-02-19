import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ChevronUpDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { DocumentIcon, PencilIcon } from "@heroicons/react/24/solid";
import ExcelJS from "exceljs";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  IconButton,
  Tooltip,
  Input,
  Button,
} from "@material-tailwind/react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  getOneRecordsCertificateStud,
  getOneRecordsConferenceStud,
  getOneRecordsHigherEdu,
  getOneRecordsInternship,
  getOneRecordsOrganized,
  getOneRecordsParticipation,
  getOneRecordsResearchStud,
  getOneRecordsSport,
  getOneRecordsTechnicalStud,
  deleteRecordsCertificateStud,
  deleteRecordsConferenceStud,
  deleteRecordsHigherEdu,
  deleteRecordsInternship,
  deleteRecordsOrganized,
  deleteRecordsParticipation,
  deleteRecordsResearchStud,
  deleteRecordsSport,
  deleteRecordsTechnicalStud,
  updateRecordsCertificateStud,
  updateRecordsConferenceStud,
  updateRecordsHigherEdu,
  updateRecordsInternship,
  updateRecordsOrganized,
  updateRecordsParticipation,
  updateRecordsResearchStud,
  updateRecordsSport,
  updateRecordsTechnicalStud,
} from "../API_Routes";
import { useNavigate } from "react-router-dom";

export default function TableData({ tableName }) {
  const { currentUser } = useSelector((state) => state.user);
  const [tableHead, setTableHead] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [editableFields, setEditableFields] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const navigate = useNavigate();

  // getRecords by username apis
  const getApiRoute = (tableName) => {
    const apiRoutes = {
      Internship: (username) => getOneRecordsInternship(username),
      Research: (username) => getOneRecordsResearchStud(username),
      "Conference publication": (username) =>
        getOneRecordsConferenceStud(username),
      "Certificate Course Attended": (username) =>
        getOneRecordsCertificateStud(username),
      "Sport Data": (username) => getOneRecordsSport(username),
      "Event Participated": (username) => getOneRecordsParticipation(username),
      "Event Organized": (username) => getOneRecordsOrganized(username),
      "Technical Events": (username) => getOneRecordsTechnicalStud(username),
      "Higher Education": (username) => getOneRecordsHigherEdu(username),
    };

    return apiRoutes[tableName];
  };

  //delete apis
  const deleteAPIRoute = (tableName) => {
    const deleteRoutes = {
      Internship: (username, S_ID) =>
        `${deleteRecordsInternship}?username=${username}&S_ID=${S_ID}`,
      Research: (username, S_ID) =>
        `${deleteRecordsResearchStud}?username=${username}&S_ID=${S_ID}`,
      "Conference publication": (username, S_ID) =>
        `${deleteRecordsConferenceStud}?username=${username}&S_ID=${S_ID}`,
      "Certificate Course Attended": (username, S_ID) =>
        `${deleteRecordsCertificateStud}?username=${username}&S_ID=${S_ID}`,
      "Sport Data": (username, S_ID) =>
        `${deleteRecordsSport}?username=${username}&S_ID=${S_ID}`,
      "Event Participated": (username, S_ID) =>
        `${deleteRecordsParticipation}?username=${username}&S_ID=${S_ID}`,
      "Event Organized": (username, S_ID) =>
        `${deleteRecordsOrganized}?username=${username}&S_ID=${S_ID}`,
      "Technical Events": (username, S_ID) =>
        `${deleteRecordsTechnicalStud}?username=${username}&S_ID=${S_ID}`,
      "Higher Education": (username, S_ID) =>
        `${deleteRecordsHigherEdu}?username=${username}&S_ID=${S_ID}`,
    };

    return deleteRoutes[tableName];
  };

  //update  apis
  const updateAPIRoute = (tableName) => {
    const updateRoutes = {
      Internship: (username, S_ID) =>
        `${updateRecordsInternship}?username=${username}&S_ID=${S_ID}`,
      Research: (username, S_ID) =>
        `${updateRecordsResearchStud}?username=${username}&S_ID=${S_ID}`,
      "Conference publication": (username, S_ID) =>
        `${updateRecordsConferenceStud}?username=${username}&S_ID=${S_ID}`,
      "Certificate Course Attended": (username, S_ID) =>
        `${updateRecordsCertificateStud}?username=${username}&S_ID=${S_ID}`,
      "Sport Data": (username, S_ID) =>
        `${updateRecordsSport}?username=${username}&S_ID=${S_ID}`,
      "Event Participated": (username, S_ID) =>
        `${updateRecordsParticipation}?username=${username}&S_ID=${S_ID}`,
      "Event Organized": (username, S_ID) =>
        `${updateRecordsOrganized}?username=${username}&S_ID=${S_ID}`,
      "Technical Events": (username, S_ID) =>
        `${updateRecordsTechnicalStud}?username=${username}&S_ID=${S_ID}`,
      "Higher Education": (username, S_ID) =>
        `${updateRecordsHigherEdu}?username=${username}&S_ID=${S_ID}`,
    };

    return updateRoutes[tableName];
  };

  //get all records
  const getAllRecords = async () => {
    const user = currentUser?.Username;
    try {
      const apiurl = getApiRoute(tableName)(user);
      const response = await axios.get(apiurl, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response?.data?.data.length === 0) {
        setTableHead([]);
        setTableRows([]);
      } else {
        const columnHeaders = Object.keys(response.data.data[0]);
        setTableHead(columnHeaders);

        const userRecords = response.data.data.filter(
          (record) => record.Username === currentUser.Username
        );
        setTableRows(userRecords);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDialog = (record) => {
    setRecordToDelete(record);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setRecordToDelete(null);
  };

  const onDelete = async (record) => {
    try {
      const apiurl = deleteAPIRoute(tableName)(
        currentUser.Username,
        record.S_ID
      );

      const response = await axios.delete(apiurl, {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          username: currentUser.Username,
          S_ID: record.S_ID,
        },
      });
      if (response?.status === 200) {
        toast.success("Record Deleted Successfully!", {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      const updatedRows = tableRows.filter((r) => r.S_ID !== record.S_ID);
      setTableRows(updatedRows);
    } catch (error) {
      toast.error("Failed to delete Record!", {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.error("Error deleting record:", error.response.data.message);
    }
  };

  const handleEdit = (record) => {
    const id = record.S_ID;
    navigate(`/s/general?tableName=${tableName}&id=${id}`);
  };

  useEffect(() => {
    getAllRecords();
  }, [tableName]);

  const handleLink = (link) => {
    const IP = "http://10.10.8.150";
    const PORT = 8081;
    const pathParts = link.split('\\Uploads');
    const newPath = `${IP}:${PORT}/Uploads${pathParts[1]}`;
    window.open(newPath, "_blank");
  };

  const generateExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    const headerRow = worksheet.addRow(tableHead.map((head) => head));

    tableRows.forEach((row) => {
      const dataRow = tableHead.map((head) => {
        if (head.includes("Date")) {
          return moment(row[head]).format("YYYY-MM-DD");
        } else {
          return row[head];
        }
      });
      worksheet.addRow(dataRow);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const handleGenerateExcel = () => {
    generateExcel();
  };

  return (
    <>
      <Card className="h-full w-full p-3">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between gap-8 mt-2">
            {tableRows.length > 0 && (
              <div>
                <Typography variant="h5" color="blue-gray">
                  {tableName}
                </Typography>
              </div>
            )}
          </div>
        </CardHeader>
        {tableRows.length > 0 ? (
          <>
            <CardBody className="px-0">
              <div className="overflow-x-auto mx-4">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {tableHead.map((head, index) => (
                        <th
                          key={head}
                          className={`${index === 0 ? "hidden" : ""
                            } cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50`}
                        >
                          <Typography
                            variant="small"
                            color="blue"
                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 text-blue-700"
                          >
                            {head}{" "}
                            {index !== tableHead.length - 1 && (
                              <ChevronUpDownIcon
                                strokeWidth={2}
                                className="h-4 w-4"
                              />
                            )}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((record, index) => (
                      <tr
                        key={index}
                        className={`border-b border-solid border-blue-gray-200 ${index % 2 === 0 ? "bg-blue-gray-50" : "bg-white"
                          }`}
                      >
                        {tableHead.map((head, colIndex) => (
                          <td
                            key={head}
                            className={`${colIndex === 0 ? "hidden" : ""
                              } p-4 whitespace-normal border-r ${colIndex === tableHead.length - 1
                                ? ""
                                : "border-solid border-blue-gray-200"
                              }`}
                          >
                            {head.startsWith("Upload") ? (
                              <DocumentIcon
                                onClick={() => handleLink(record[head])}
                                className="cursor-pointer w-6 h-6"
                              />
                            ) : head.includes("Date") ? (
                              <Typography
                                variant="body"
                                color="black"
                                className="text-dark font-bold"
                              >
                                <p>{moment(record[head]).format("YYYY-MM-DD")}</p>
                              </Typography>
                            ) : (
                              <Typography
                                variant="body"
                                color="black"
                                className="text-dark font-bold"
                              >
                                <p>{record[head]}</p>
                              </Typography>
                            )}
                          </td>
                        ))}
                        <td className="p-4 border-r border-solid border-blue-gray-200">
                          <Tooltip content="Edit data">
                            <IconButton
                              onClick={() => handleEdit(record)}
                              variant="text"
                            >
                              <PencilIcon className="h-4 w-4 text-blue-500" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Delete data">
                            <IconButton
                              onClick={() => handleOpenDialog(record)}
                              variant="text"
                            >
                              <TrashIcon className="h-4 w-4 text-red-500" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </>
        ) : (
          <Typography variant="h5" color="blue-gray" className="text-center">
            {tableName} has no Records!
          </Typography>
        )}
        {tableRows.length > 0 && (
          <div className="mt-4 text-right">
            <Button
              onClick={handleGenerateExcel}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Generate Excel
            </Button>
          </div>
        )}
      </Card>
      <Dialog open={showDialog} size="sm" handler={handleCloseDialog}>
        <DialogHeader>Warning</DialogHeader>
        <DialogBody>Are you sure you want to delete this record?</DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleCloseDialog}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => {
              onDelete(recordToDelete);
              handleCloseDialog();
            }}
          >
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

TableData.propTypes = {
  tableName: PropTypes.string.isRequired,
};
