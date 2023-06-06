const { syncer } = require("../config")
const sdk = require('api')('@reservoirprotocol/v1.0#hx9czli4wgtr0');
sdk.server(syncer.reservoir[syncer.CHAIN].url);
const collectionId = syncer.reservoir[syncer.CHAIN].contract
sdk.auth(syncer.RESERVOIR_API_KEYS[0]);

async function getOnSaleTokens(continuation, startTimestamp) {
    return new Promise(function (resolve, reject) {
        try {
            const reqObj = {
                contract: collectionId,
                sortDirection: 'asc',
                limit: process.env.LIMIT_LISTING_CRON || '200',
                accept: '*/*',
            };
            if (continuation) {
                reqObj.continuation = continuation;
            }
            if (startTimestamp) {
                reqObj.startTimestamp = startTimestamp;
            }

            sdk.getEventsOrdersV1(reqObj)
                .then(res => {
                    resolve({ events: res.events, continuation: res.continuation })
                })
                .catch(err => reject(err));
        } catch (error) {
            reject(error.message);
        }
    });
}

async function getOnSaleTokensV3(continuation, startTimestamp) {
    return new Promise(function (resolve, reject) {
        try {
            const reqObj = {
                contract: collectionId,
                sortDirection: 'asc',
                includeCriteriaMetadata: true,
                limit: process.env.LIMIT_LISTING_CRON || '200',
                accept: '*/*',
            };
            if (continuation) {
                reqObj.continuation = continuation;
            }
            if (startTimestamp) {
                reqObj.startTimestamp = startTimestamp;
            }

            sdk.getEventsAsksV3(reqObj)
                .then(res => {
                    resolve({ events: res.events, continuation: res.continuation })
                })
                .catch(err => reject(err));
        } catch (error) {
            reject(error.message);
        }
    });
}

async function getSoldTokens(continuation, startTimestamp) {
    const reqObj = {
        contract: collectionId,
        limit: 100,
        Accept: '*/*',
    };
    if (continuation) {
        reqObj.continuation = continuation;
    }
    if (startTimestamp) {
        reqObj.startTimestamp = startTimestamp;
    }
    let { data } = await sdk.getSalesV4(reqObj)

    return { sales: data ? data.sales : [], continuation: data ? data.continuation : null }
}

async function getBulkSoldTokens(continuation, startTimestamp, endTimestamp) {

    const reqObj = {
        contract: collectionId,
        limit: '1000',
        Accept: '*/*',
    };
    if (continuation) {
        reqObj.continuation = continuation;
    }
    if (startTimestamp) {
        reqObj.startTimestamp = startTimestamp;
    }
    if (endTimestamp) {
        reqObj.endTimestamp = endTimestamp;
    }

    let { data } = await sdk.getSalesBulkV1(reqObj)
    return ({ sales: data.sales, continuation: data.continuation })

}

async function getEventTokens(continuation, startTimestamp) {
    const reqObj = {
        collection: collectionId,
        sortDirection: 'desc',
        limit: '1000',
        Accept: '*/*',
    };
    if (continuation) {
        reqObj.continuation = continuation;
    }
    if (startTimestamp) {
        reqObj.startTimestamp = startTimestamp;
    }
    const events = await sdk.getEventsOrdersV1(reqObj);
    return { events: events.events, continuation: events.continuation }
}

async function refreshTokenData(token) {
    return new Promise(async function (resolve, reject) {
        try {
            const response = await sdk.postTokensRefreshV1({ token: `${collectionId}:${token}` }, { accept: '*/*' });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    })
}

async function getTokenOrders(token) {
    return new Promise(async function (resolve, reject) {
        try {
            const response = await sdk.getOrdersAsksV3({
                token: `${collectionId}:${token}`,
                includePrivate: 'true',
                includeMetadata: 'false',
                includeRawData: 'false',
                sortBy: 'createdAt',
                accept: '*/*'
            });
            resolve(response.orders);
        } catch (error) {
            reject(error);
        }
    })
}

async function getOrdersAsksByID(orderId) {
    return new Promise(async function (resolve, reject) {
        try {
            const response = await sdk.getOrdersAsksV3({
                ids: orderId,
                includePrivate: 'true',
                includeMetadata: 'false',
                includeRawData: 'false',
                sortBy: 'createdAt',
                accept: '*/*'
            });
            resolve(response.orders);
        } catch (error) {
            reject(error);
        }
    })
}

async function getOrdersAsksByIDArr(orderIds) {
    return new Promise(async function (resolve, reject) {
        try {
            const response = await sdk.getOrdersAsksV3({
                ids: orderIds,
                includePrivate: 'true',
                includeMetadata: 'false',
                includeRawData: 'false',
                sortBy: 'createdAt',
                accept: '*/*'
            });
            resolve(response.orders);
        } catch (error) {
            reject(error);
        }
    })
}


module.exports = { getOnSaleTokens, getOnSaleTokensV3, getSoldTokens, getBulkSoldTokens, getEventTokens, refreshTokenData, getTokenOrders, getOrdersAsksByID, getOrdersAsksByIDArr }