const { syncer } = require('./config');
const cron = require("node-cron");
const { syncSales } = require('./controllers/sold-items.controllers');
const { syncAvailability } = require('./controllers/availability.controller');

let IS_AVAILABILITY_CRON_RUNNING = false;


exports.init = async () => {
    cron.schedule("*/1 * * * *", async () => {
        if (syncer.toSync.sales) {
            syncSales();
        }
        if (syncer.toSync.listing) {
            // syncListing();
        }

        if (syncer.toSync.availability) {
            syncAvailability();
        }
    });
    console.log("Cron Initilized.");
}