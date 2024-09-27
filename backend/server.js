const express = require("express"); 
const cors = require("cors"); 
const { CosmosClient } = require("@azure/cosmos");
require("dotenv").config(); 

const endpoint = process.env.ENDPOINT;
const key = process.env.ENDPOINT_KEY;
const client = new CosmosClient({ endpoint, key });

const database = client.database("cni");

const cniContainer = database.container("team9-cni-nodes"); 

const app = express(); 

app.use(express.json()); 
app.use(cors()); 

app.listen(8000, () => console.log(`Server started on port 8000`)); 

app.get("/", (req, res) => {
    res.send("Hello world"); 
})

app.get("/cni", async (req, res) => { 
    try { 
        const { resources } = await cniContainer.items.query("SELECT * FROM c ORDER BY c['Power Plant']").fetchAll();
    
        res.status(200).json(resources); 
    } catch(e) { 
        res.status(500).json({
            error: "Internal server error, please try again"
        }); 
    }
})

app.get("/cni/statuses", async (req, res) => {
    try { 
        const { resources } = await cniContainer.items.query("SELECT c.Status AS label, COUNT('Status') AS 'value' FROM c GROUP BY c.Status").fetchAll(); 

        res.status(200).json(resources); 
    } catch (e) { 
        res.status(500).json({
            error: "Internal server error, please try again"
        })
    }
})

app.get("/cni/types", async (req, res) => { 
    try { 
        const { resources } = await cniContainer.items.query("SELECT c.Type AS label, COUNT('Type') AS 'value' FROM c GROUP BY c.Type").fetchAll(); 

        res.status(200).json(resources); 
    } catch (e) { 
        res.status(500).json({
            error: "Internal server error, please try again"
        })
    }
})

app.get("/attacks", async (req, res) => { 
    try { 
        const { resources } = await cniContainer.items.query("SELECT c.id, c['Power Plant'], r AS attack FROM  container c JOIN r in c.reportedAttacks").fetchAll(); 

        res.status(200).json(resources); 
    } catch(e) { 
        res.status(500).json({
            error: "Internal server error, please try again"
        })
    }
})