const { syncer } = require('./config');
const cron = require("node-cron");
const { syncSales } = require('./controllers/sold-items.controllers');
exports.init = async () => {
    cron.schedule("*/1 * * * *", async () => {
        if (syncer.toSync.sales) {
            syncSales();
        }
        if (syncer.toSync.listing) {
            // syncListing();
        }
    });
    console.log("Cron Initilized.");
}