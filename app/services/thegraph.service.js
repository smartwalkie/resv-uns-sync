const { gql, request } = require('graphql-request')

const CHAIN_CONFIG = require("./../config/chain")
const { syncer } = require("../config");
const { convertTokenToHex } = require('../utils/token.utils');

const chainId = syncer.chains[syncer.CHAIN]

async function getDomain(tokenId) {

    if (!chainId || !tokenId) {
        throw new Error(
            `Invalid arguments [chainId: ${chainId}, tokenId: ${tokenId}]`
        );
    }

    const { client } = CHAIN_CONFIG[chainId];
    if (!client) {
        throw new Error(`Unsupported chain ${chainId}`);
    }

    const id = convertTokenToHex(tokenId)
    const data = await client.request(
        gql`
        query GetDomain($id: ID!) {
            domain(id: $id) {
            id
            name
            registry
            owner {
                id
            }
            resolver {
                address
                records {
                key
                value
                }
            }
            }
        }
        `,
        { id: String(id).toLowerCase() }
    );

    const { domain } = data;
    if (!domain) {
        return {};
    }

    return {
        id: domain.id,
        name: domain.name,
        owner: domain.owner.id,
        registry: domain.registry,
        resolver: (domain.resolver || {}).address,
        records: _parseRecords(domain.resolver),
    };
}

const _parseRecords = (resolver) => {
    if (!resolver || !resolver.records) {
        return {};
    }

    return Object.values(resolver.records).reduce((obj, r) => {
        obj[r.key] = r.value;
        return obj;
    }, {});
};

module.exports = {
    getDomain
}