require('dotenv').config()


module.exports = {
    server: {
        PORT: process.env.PORT || 3000,
        NODE_ENV: process.env.NODE_ENV || 'staging',
    },
    mezmo: {
        key: process.env.MEZMO_KEY,
        appName: process.env.MEZMO_APP_NAME || 'RESV-UNS-SYNC',
        hostName: process.env.MEZMO_HOST_NAME || 'RESV-UNS-SYNC',
    },
    syncer: {
        RESERVOIR_API_KEYS: process.env.RESERVOIR_API_KEYS ? process.env.RESERVOIR_API_KEYS.split(',') : 'demo-api-key',
        CHAIN: process.env.CHAIN,
        CONTRACTS: process.env.CONTRACTS,
        toSync: {
            listing: process.env.SYNC_LISTING === '1',
            sales: process.env.SYNC_SALES === '1',
        },
        reservoir: {
            polygon: {
                url: 'https://api-polygon.reservoir.tools',
                contract: '0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f'
            },
            goerli: {
                url: 'https://api.reservoir.tools',
                contract: '0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f'
            },

        },
        chains: {
            mainnet: 1,
            goerli: 5,
            polygon: 137,
            mumbai: 80001,
        }
    }
}