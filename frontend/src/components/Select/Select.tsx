import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import "./Select.css";

interface BasicSelectProps {
  onViewChange: (view: SelectChangeEvent) => void;
  view: string;
}

export default function BasicSelect({ onViewChange, view }: BasicSelectProps) {
  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl fullWidth className="select">
        <InputLabel>Filter by Type</InputLabel>
        <Select value={view} label={"Filter"} onChange={onViewChange}>
          <MenuItem value={"All"}>All Types</MenuItem>
          <MenuItem value={"Solar"}>Solar</MenuItem>
          <MenuItem value={"Coal"}>Coal</MenuItem>
          <MenuItem value={"Gas"}>Gas</MenuItem>
          <MenuItem value={"Hydro"}>Hydro</MenuItem>
          <MenuItem value={"Nuclear"}>Nuclear</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
