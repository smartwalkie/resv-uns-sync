const { gql, request } = require('graphql-request')
const { difference, pluck } = require('underscore')
const CHAIN_CONFIG = require("./../config/chain")
const { syncer } = require("../config");
const { TokenToHex } = require('../utils/token.utils');

const chainId = syncer.chains[syncer.CHAIN]

async function getSingleDomain(tokenId) {

    if (!chainId || !tokenId) {
        throw new Error(
            `Invalid arguments [chainId: ${chainId}, tokenId: ${tokenId}]`
        );
    }

    const { client } = CHAIN_CONFIG[chainId];
    if (!client) {
        throw new Error(`Unsupported chain ${chainId}`);
    }

    const id = TokenToHex(tokenId)
    const data = await client.request(
        gql`
        query getSingleDomain($id: ID!) {
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

async function getDomains(nameHashes) {

    if (!chainId || !nameHashes?.length) {
        throw new Error(
            `Invalid arguments [chainId: ${chainId}, tokenId Length: ${nameHashes.length}]`
        );
    }

    const data = await _getDomainNamesMap(
        chainId,
        nameHashes
    );

    const unknownTokens = difference(nameHashes, pluck(data, 'id'))

    let parsedUnknownDomains = []
    if (unknownTokens.length) {
        parsedUnknownDomains = await _getDomainNamesMap(
            CHAIN_CONFIG[chainId].linkedChainId,
            unknownTokens
        )
    }

    return [...data, ...parsedUnknownDomains];
}


const _getDomainNamesMap = async (chainId, tokenIds) => {
    const client = CHAIN_CONFIG[chainId].client
    if (!client) {
        throw new Error(`Unsupported chain ${chainId}`)
    }

    const data = await client.request(gql`
        query filteredDomains($ids: [ID!]!) {
        domains(where: { id_in: $ids }) {
            id
            name
            registry
            createdAt
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
        `, {
        ids: tokenIds
    })

    const { domains } = data
    if (!domains) {
        return []
    }

    return _parseDomains(domains)
}
const _parseDomains = (domains) => {
    if (!domains || !Array(domains).length) {
        return []
    }

    return Object.values(domains).map((d) => {
        return {
            id: d.id,
            name: d.name,
            owner: d.owner.id,
            registry: d.registry,
            createdAt:d.createdAt,
            resolver: (d.resolver || {}).address,
            records: _parseRecords(d.resolver)
        }
    })
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
    getSingleDomain,
    getDomains
}