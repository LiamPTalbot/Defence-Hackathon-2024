import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { Box } from "@mui/material";
import { MapBox } from "../components/MapBox/MapBox";
import { TelegramBox } from "../components/MapBox/TelegramBox";
import { HospitalBox } from "../components/MapBox/HospitalBox";
import GraphBox from "../components/GraphBox/GraphBox";
import "./dashboard.css";
import { Footer } from "../components/Footer/Footer";
import TableView from "../components/TableView/TableView.tsx";
import { ReportBox } from "../components/ReportBox/ReportBox";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("Map");

  const handleTabClick = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Table View":
        return <TableView handleTabClick={handleTabClick} />;
      case "Map":
        return <MapBox />;
      case "Graphs":
        return <GraphBox />;
      case "Report":
        return <ReportBox />;
      case "Telegram":
        return <TelegramBox />;
      case "Hospitals":
        return <HospitalBox />;
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="wrapper">
        <div className="header">
          <div className="titles">
            <div className="h1-header">
              <img src="/idatu-logo.png" alt="logo" />
              <h1> Infrastructure Damage Assessment Tool for Ukraine</h1>
            </div>
            <div className="h2-header">
              <h2>Damaged infrastructure and high risk areas</h2>
            </div>
          </div>
          <div className="mod-logo">
            <a
              href="https://www.gov.uk/government/organisations/ministry-of-defence"
              target="_blank"
            >
              <img src="/mod-logo.png" width="100px" alt="logo" />
            </a>
          </div>
        </div>
        <div className="body">
          <div className="tabnav-container">
            <Box sx={{ width: "100%", bgcolor: "#94a3b8" }}>
              <Tabs
                value={activeTab}
                onChange={handleTabClick}
                indicatorColor="primary"
                textColor="inherit"
              >
                <Tab label="Power Station Table" value="Table View" />
                <Tab label="Power Station Map" value="Map" />
                <Tab label="Charts" value="Graphs" />
                <Tab label="Telegram Report" value="Report" />
                <Tab label="Telegram Map" value="Telegram" />
                <Tab label="Hospitals" value="Hospitals" />
              </Tabs>
            </Box>

            <div className="tab-content">{renderContent()}</div>
          </div>
        </div>
        <Footer />
      </div>
    </LocalizationProvider>
  );
}
