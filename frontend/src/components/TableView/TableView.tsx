import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Box from "@mui/material/Box";

interface ICniNode {
    id: any,
    Type: String,
    Status: String,
    Longitude: Number,
    Latitude: Number,
    reportedAttacks: Array<String> | null,
    "Power Plant": String
}

console.log("API URL: " + import.meta.env.VITE_API_URL); 

interface ICniNodes extends Array<ICniNode> {}
// @ts-ignore
const TableView = ({ handleTabClick }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [_, setSearchParams] = useSearchParams();
    const [cniNodes, setCniNodes] = useState<ICniNodes>([]);

    useEffect(() => {
        getCniNodes();
    }, [])

    const getCniNodes = () => {
        fetch("http://localhost:8000/cni")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setCniNodes(data);
                setIsLoading(false);
            });
    }

    return (
        <>
            {isLoading ?
                <Box>
                    <CircularProgress />
                </Box>
                :
                <Paper sx={{ width: '100%', overflow: 'hidden' }} >
                    <TableContainer sx={{maxHeight: "600px" }}>
                        <Table stickyHeader aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Location Name</b></TableCell>
                                    <TableCell><b>CNI Type</b></TableCell>
                                    <TableCell><b>Status</b></TableCell>
                                    <TableCell><b>Number of Reported Attacks</b></TableCell>
                                    <TableCell><b>Actions</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cniNodes.map((cniNode) => (
                                    <TableRow
                                        key={cniNode.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {cniNode["Power Plant"]}
                                        </TableCell>
                                        <TableCell>{cniNode.Type}</TableCell>
                                        <TableCell>{cniNode.Status}</TableCell>
                                        {cniNode.reportedAttacks ? <TableCell>{cniNode?.reportedAttacks.length}</TableCell> : <TableCell>0</TableCell>}
                                        <TableCell><Button onClick={(e) => {
                                            setSearchParams({ 
                                                "latitude": String(cniNode.Latitude), 
                                                "longitude": String(cniNode.Longitude), 
                                                "zoom": "12" 
                                            });
                                            handleTabClick(e, "Map");
                                        }} variant="contained">View on Map</Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            }
        </>

    )
}

export default TableView;
