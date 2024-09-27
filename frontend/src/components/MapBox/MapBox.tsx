import "./MapBox.css";
import Map from "./Map.tsx";
import { AzureMapsProvider } from "react-azure-maps";
import BasicSelect from "../Select/Select.tsx";
import { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";

export function MapBox() {
  const [selectedType, setSelectedType] = useState("All");
  const [isDecommissioned, setIsDecommissioned] = useState(false);
  const [reportedAttacks, setReportedAttacks] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedType(event.target.value);
  };

  return (
    <>
      <div className="controls-container">
        <div className="select-container">
          <BasicSelect onViewChange={handleChange} view={selectedType} />
        </div>
        <div className="checkboxes-container">
          <div className="checkbox-container">
            <FormControlLabel
              control={
                <Checkbox
                  checked={isDecommissioned}
                  onChange={(e) => setIsDecommissioned(e.target.checked)}
                />
              }
              label="Decommissioned"
            />
          </div>
          <div className="checkbox-container">
            <FormControlLabel
              control={
                <Checkbox
                  checked={reportedAttacks}
                  onChange={(e) => setReportedAttacks(e.target.checked)}
                />
              }
              label="Reported Attacks"
            />
          </div>
        </div>
      </div>
      <AzureMapsProvider>
        <Map
          view={selectedType}
          isDecommissioned={isDecommissioned}
          reportedAttacks={reportedAttacks}
        />
      </AzureMapsProvider>
    </>
  );
}
