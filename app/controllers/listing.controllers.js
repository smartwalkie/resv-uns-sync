const moment = require('moment');
const { server } = require('../config')
const { Timestamp } = require("../models");
let IS_SOLD_JOB_RUNNING = false;

exports.syncListing = async () => {
    const timestampRecord = await Timestamp.findOne({ type: 'sold' });
    console.log('\n\n[syncSalesCron]==== Trigger Sold Cron job at =====>' + timestampRecord);
    if (IS_SOLD_JOB_RUNNING) {
        console.log('[syncSalesCron] sync Sold Data job still running, skip.')
        return;
    }

    syncListingData(null, timestampRecord ? moment(timestampRecord?.lastFetched).unix() : moment().subtract(1, 'hours').unix());
}

async function syncListingData(seq, upToTime) {
    try {
        IS_SOLD_JOB_RUNNING = true;
        IS_SOLD_JOB_RUNNING = false;
    } catch (error) {
        IS_SOLD_JOB_RUNNING = false;
        console.log(error);
    }
}