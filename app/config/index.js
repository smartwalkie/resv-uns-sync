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
            mainnet:{
                url:'https://api.reservoir.tools', // verified
                contract:'0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe' // verified
            },
            polygon: {
                url: 'https://api-polygon.reservoir.tools',  // verified
                contract: '0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f' // verified
            },
            goerli: {
                url: 'https://api.reservoir.tools',
                contract: '0x801452cfac27e79a11c6b185986fde09e8637589'
            },
            mumbai:{
                url:'',
                contract:'0x2a93c52e7b6e7054870758e15a1446e769edfb93'
            }
            

        },
        chains: {
            mainnet: 1,
            goerli: 5,
            polygon: 137,
            mumbai: 80001,
        }
    }
}