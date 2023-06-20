const moment = require('moment');
const { SoldItems, UNSCollections, Timestamp } = require("../models");
const { getSoldTokens } = require("../services/reservoir.service");
const { getSingleDomain } = require("../services/thegraph.service");
let IS_SOLD_JOB_RUNNING = false;

exports.syncSales = async () => {
    const timestampRecord = await Timestamp.findOne({ type: 'sold' });
    console.log('\n\n[syncSalesCron]==== Trigger Sold Cron job at =====>' + timestampRecord);
    if (IS_SOLD_JOB_RUNNING) {
        console.log('[syncSalesCron] sync Sold Data job still running, skip.')
        return;
    }

    syncSalesData(null, timestampRecord ? moment(timestampRecord?.lastFetched).unix() : moment().subtract(1, 'hours').unix());
}

async function syncSalesData(seq, upToTime) {
    try {
        IS_SOLD_JOB_RUNNING = true;
        console.log('[syncSalesCron] fetching for page=> ' + seq + " from Time " + new Date(upToTime * 1000) + " (" + upToTime + ")");

        const { sales, continuation } = await getSoldTokens(seq, upToTime);
        let tokenSales = [];

        for (let i = 0; i < sales.length; i++) {
            const sale = sales[i];
            if (!sale.token.name) {
                let ensname = await getSingleDomain(sale.token.tokenId);

                if (ensname && ensname.name) {
                    sale.token.name = ensname.name
                }
            }

            let findQuery = { $or: [{ "token": sale.token.tokenId }] }
            let clubData = await UNSCollections.find(findQuery);
            
            tokenSales.push({
                token: sale.token.tokenId,
                name: sale.token.name,
                price: sale.price.amount.native,
                currency: sale.price.currency.symbol,
                soldData: sale.saleId,
                from: sale.from,
                to: sale.to,
                orderKind: sale.orderKind,
                source: sale.orderSource,
                date: new Date(sale.timestamp * 1000).toISOString(),
                club: clubData.map((c) => c.slug),
            });
        }
        await SoldItems.bulkWrite(tokenSales.map(token => ({
            updateOne: {
                filter: { soldData: token.soldData, source: token.source },
                update: token,
                upsert: true,
            }
        })))

        if (!seq && tokenSales[0]) {
            await Timestamp.updateOne({ type: 'sold' },
                { $set: { lastSaved: tokenSales[0].date } }
            );
        }

        if (tokenSales.length > 0) {
            console.log("[syncSalesCron] Sold Data Saved from  : " + tokenSales[tokenSales.length - 1].date + " to " + tokenSales[0].date);
        }

        if (continuation) {
            syncSalesData(continuation, upToTime);
        } else {
            const timestampRecord = await Timestamp.findOne({ type: 'sold' });
            if (timestampRecord.lastSaved) {
                await Timestamp.updateOne({ type: 'sold' },
                    { $set: { type: 'sold', lastFetched: timestampRecord.lastSaved } },
                    { upsert: true }
                );
            }
            await Timestamp.updateOne({ type: 'sold' },
                { $set: { lastSaved: null } }
            );

            /**
             * Need to confirm cron has run in prod environment
             */
            // if (server.NODE_ENV === 'production' && tokenSales.length > 0) {
            //     confirmSoldCronRun();
            // }
            IS_SOLD_JOB_RUNNING = false;

        }
    } catch (error) {
        IS_SOLD_JOB_RUNNING = false;
        console.log(error);
    }
}