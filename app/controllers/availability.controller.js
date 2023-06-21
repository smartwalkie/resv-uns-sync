const { CronFetchIndex, UNSCollections } = require("../models");
const { getDomains } = require('../services/thegraph.service');
const { syncer } = require('../config');
const { chunk } = require("underscore");

let IS_AVAILABILITY_CRON_RUNNING = false;

exports.syncAvailability = async () => {
    console.log("[Availability cron] Running names availability cron");
    syncAvailabilityData();
}

async function syncAvailabilityData(limit = syncer.AVAILABILITY_CRON_LIMIT) {
    if (IS_AVAILABILITY_CRON_RUNNING) {
        console.log("[Availability cron] already running");
        return;
    }

    const cronStatus = await CronFetchIndex.findOne({ type: "availability" });
    let startId = cronStatus?.lastFetchedId;
    if (!startId) {
        let firstRecord = await UNSCollections.findOne();
        startId = firstRecord?._id;
    }

    console.log(`[Availability cron] startId: ${startId}`);
    let matchQuery = {
        _id: { $gt: startId }
    };


    const unsNames = await UNSCollections.aggregate([
        {
            $match: matchQuery,
        },
        { $sort: { _id: 1 } },
        { $limit: limit },
    ]);


    console.log(`[Availability cron] names to check: ${unsNames.length}`);

    const namehashes = unsNames.map((uns) => uns.namehash);
    const namehashesChunked = chunk(namehashes, limit / (limit < 9000 ? 5 : 10));


    const nameRegistrationsChunked = await Promise.all(
        namehashesChunked.map((hashes) => getDomains(hashes))
    );

    const nameRegistrations = nameRegistrationsChunked.reduce((prev, curr) => {
        return prev.concat(curr);
    }, []);


    const recordsToUpdate = nameRegistrations.map(r => {
        return {
            namehash: r.id,
            registration: {
                contract: r.registry,
                registrationDate: new Date(
                    +r.createdAt * 1000
                ),
                owner: r.owner,
                isAvailable: !r.owner,
            }
        }
    });

    console.log(recordsToUpdate);

    let updateResp = await UNSCollections.bulkWrite(
        recordsToUpdate.map((doc) => ({
            updateOne: {
                filter: { namehash: doc.namehash },
                update: { $set: { registration: doc.registration } },
                hint: {
                    namehash: 1
                },
            },
        }))
    );

    let lastFetchedId = unsNames?.at(-1)?._id;

    if (unsNames.length === 0) {
        let firstRecordItem = await UNSCollections.findOne();
        console.log(
            `[Availability cron] All Names Updated Restarting Cron... ${firstRecordItem}`
        );
        lastFetchedId = firstRecordItem?._id;
    } else {
        console.log(`[Availability cron] ${updateResp?.result?.nModified
            } names updated.
        Last: ${JSON.stringify(unsNames[unsNames.length - 1])}
      `);
    }

    await CronFetchIndex.updateOne(
        { type: "availability" },
        {
            lastFetchedId: lastFetchedId,
        },
        { upsert: true }
    );



    // Enable code below if using cron
    IS_AVAILABILITY_CRON_RUNNING = false;

    try {
    } catch (error) {
        console.log("[Availability cron] Cron syncNamesAvalabilitys error: ");
        console.log(error);
        IS_AVAILABILITY_CRON_RUNNING = false;
    }
}