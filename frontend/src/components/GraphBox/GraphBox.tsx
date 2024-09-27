import { PieChart } from '@mui/x-charts/PieChart';
import { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import "./GraphBox.css";
import { BarChart } from '@mui/x-charts';

type StatusData = {
    label: string;
    value: number
}

type CniNode = {
    "Power Plant": string,
    reportedAttacks: Array<object>;
}

const GraphBox = () => {
    const [statusData, setStatusData] = useState<StatusData[]>([]);
    const [typeData, setTypeData] = useState([]);
    const [numberOfAttacks, setNumberOfAttacks] = useState(0);
    const [cniNodes, setCniNodes] = useState([]);
    const [attackData, setAttackData] = useState<any>([])


    useEffect(() => {
        fetch("http://localhost:8000/cni/statuses")
            .then(response => response.json())
            .then(data => {
                const statusData = [];

                for (const item of data) {
                    if (item.label === "Operational") {
                        statusData.push({
                            ...item,
                            color: "green"
                        })
                    } else {
                        statusData.push({
                            ...item,
                            color: "red"
                        })
                    }
                }
                setStatusData(statusData)
            });
    }, [])

    useEffect(() => {
        fetch("http://localhost:8000/cni/types")
            .then(response => response.json())
            .then(data => setTypeData(data))
    }, [])

    useEffect(() => {
        fetch("http://localhost:8000/cni")
            .then(response => response.json())
            .then(data => {
                setCniNodes(data)

                const attackData = []

                for (const cniNode of data) {
                    attackData.push({
                        dataKey: cniNode["Power Plant"],
                        "Power Plant": cniNode["Power Plant"],
                        reportedAttacks: cniNode.reportedAttacks,
                        reportedAttackCount: cniNode.reportedAttacks?.length | 0
                    })
                }

                attackData.sort((a: CniNode, b: CniNode) => {
                    const leftAttackCount = a.reportedAttacks?.length | 0;
                    const rightAttackCount = b.reportedAttacks?.length | 0;

                    return rightAttackCount - leftAttackCount;
                });

                setAttackData(attackData);
                console.log(attackData);
            })
    }, [])

    useEffect(() => {
        fetch("http://localhost:8000/attacks")
            .then(response => response.json())
            .then(data => setNumberOfAttacks(data.length))
    }, [])

    return (
        <div id="graph-box">

            <Card sx={{ height: 250, width: 500 }}>
                <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Typography>
                        Total Number of Reported Attacks
                    </Typography>
                    <Typography sx={{ fontSize: "2em" }}>
                        {numberOfAttacks}
                    </Typography>
                </CardContent>
            </Card>

            <Card sx={{ height: 250, width: 500 }}>
                <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Typography>
                        Total Number of CNI Nodes
                    </Typography>
                    <Typography sx={{ fontSize: "2em" }}>
                        {cniNodes.length}
                    </Typography>
                </CardContent>
            </Card>

            <Card sx={{ height: 250, width: 500 }}>
                <CardContent sx={{ height: "100%", width: "100%" }}>
                    <p>CNI Nodes Statuses</p>
                    <PieChart
                        series={[
                            {
                                data: statusData,
                            },
                        ]}
                    />
                </CardContent>
            </Card>

            <Card sx={{ height: 250, width: 500 }}>
                <CardContent sx={{ height: "100%", width: "100%" }}>
                    <p>CNI Nodes by Type</p>
                    <PieChart
                        series={[
                            {
                                data: typeData,
                            },
                        ]}
                    />
                </CardContent>
            </Card>

            <Card sx={{ height: 250, width: 500 }}>
                <CardContent sx={{ height: "100%", width: "100%" }}>
                    <p>CNI Nodes With the Most Attacks</p>
                    <BarChart
                        dataset={attackData.slice(0, 10)}
                        yAxis={[{ label: "Number of Attacks", dataKey: "Power Plant" }]}
                        series={[{ dataKey: 'reportedAttackCount', label: 'Reported attacks' }]}
                        layout="vertical"
                        xAxis={[{
                            scaleType: "band", 
                            dataKey: "Power Plant"
                        }]}
                        colors={["red"]}
                    />
                </CardContent>
            </Card>


        </div>
    )
}

export default GraphBox;
