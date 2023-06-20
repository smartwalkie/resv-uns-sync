require('dotenv').config()
const express = require("express");

const config = require('./app/config')
require('./app/utils/mezmo.utils').initMezmo();

const app = express();
app.use(express.json());

const db = require("./app/models");
const { queues } = require('./app/queues/queue');
db.connectDatabase(() => {
    app.get("/", (req, res) => {
        res.json({ message: "Welcome...." });
    });

    require('./app/cron').init();

    Object.entries(queues).forEach(([queueName, queue]) => {
        if (require('./app/queues/processors').processorInitialisers[queueName]) {
            console.log(`Worker listening to '${queueName}' queue`);
            queue.process(require('./app/queues/processors').processorInitialisers[queueName]());
        }
    });

    // set port, listen for requests
    const PORT = config.server.PORT;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
});