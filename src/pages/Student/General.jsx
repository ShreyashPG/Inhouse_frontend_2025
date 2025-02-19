import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  Internship,
  Research,
  Conference,
  Certificate,
  SportData,
  EventParticipated,
  EventOrganized,
  TechEvents,
  HigherEdu,
} from "../../components/SModule";

export default function General() {
  // Extract query parameters from the URL
  const queryParams = new URLSearchParams(window.location.search);
  const initialTableName = queryParams.get("tableName") || "Internship";
  const id = queryParams.get("sid") || "null";

  const [selectedOption, setSelectedOption] = useState(initialTableName);

  const options = [
    { value: "Internship", label: "Internship Details" },
    { value: "Research", label: "Research Publication" },
    { value: "Conference publication", label: "Conference publication" },
    {
      value: "Certificate Course Attended",
      label: "Certificate Course Attended",
    },
    { value: "Sport Data", label: "Sport Data" },
    { value: "Event Participated", label: "Event Participated" },
    { value: "Event Organized", label: "Event Organized" },
    { value: "Technical Events", label: "Technical Events" },
    { value: "Higher Education", label: "Higher Education" },
  ];

  // A mapping of option values to their corresponding components
  const optionComponents = {
    Internship: Internship,
    Research: Research,
    "Conference publication": Conference,
    "Certificate Course Attended": Certificate,
    "Sport Data": SportData,
    "Event Participated": EventParticipated,
    "Event Organized": EventOrganized,
    "Technical Events": TechEvents,
    "Higher Education": HigherEdu,
  };

  // Function to handle the option selection
  const handleOptionChange = (event) => {
    setSelectedOption(event.value);
    console.log(event.value);
  };

  return (
    <div className="h-full" style={{ padding: "5px" }}>
      <div className="w-full mt-4 flex flex-col items-center justify-center space-y-2">
        <h2 className="text-slate-900 text-xl font-bold">
          Select your choice :
        </h2>
        <Select
          value={options.find((option) => option.value === selectedOption)}
          onChange={handleOptionChange}
          options={options}
          className="w-2/3"
        />
      </div>
      {selectedOption ? (
        <div className="w-full mt-4">
          {React.createElement(optionComponents[selectedOption])}
        </div>
      ) : (
        <Internship />
      )}
    </div>
  );
}