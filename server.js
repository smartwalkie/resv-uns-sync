require('dotenv').config()
const express = require("express");

const config = require('./app/config')
require('./app/utils/mezmo.utils').initMezmo();

const app = express();
app.use(express.json());

const db = require("./app/models");
db.connectDatabase(() => {
    app.get("/", (req, res) => {
        res.json({ message: "Welcome...." });
    });

    require('./app/cron').init();

    // set port, listen for requests
    const PORT = config.server.PORT;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
});