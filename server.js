const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

const db = require("./db"); // Assuming your db.js file is in the same directory

const { getEntries, addEntry, updateLatestEntry, getCount } = require("./db");

app.use(cors());
app.use(bodyParser.json());

app.get("/api/entries", getEntries);
app.post("/api/entries", addEntry);
app.put("/api/entries/latest", updateLatestEntry); // Updated endpoint for latest entry
app.get("/api/count", getCount);

app.listen(port, () => console.log(`Server listening on port ${port}`));
