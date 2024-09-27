import { DataGrid, GridColDef } from "@mui/x-data-grid";
import data from "../../data/telegramDataCleaned.json";

export const ReportBox = () => {
  const columns: GridColDef[] = [
    { field: "Name", headerName: "Name", width: 250 },
    { field: "Type", headerName: "Type", width: 200 },
    { field: "DamageAssessment", headerName: "Damage Assessment", width: 100 },
    { field: "RiskOfDamage", headerName: "Risk of Damage", width: 100 },
    { field: "Description", headerName: "Description", width: 400 },
    { field: "urlSource", headerName: "Source", width: 400 }, 
    { field: "timestamp", headerName: "Timestamp", width: 200 }
  ];

  const rows = data.map((row, index) => ({
    id: index + 1,
    Name: row.Name,
    Type: row.CriticalInfrastructureType,
    DamageAssessment: row.DamageAssessment,
    RiskOfDamage: row.RiskOfDamage,
    Description: row.Description,
    urlSource: row.URLSource, 
    timestamp: row.DateTime
  }));

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 100]}
        pagination
        checkboxSelection
      />
    </div>
  );
};
