const { GraphQLClient } = require('graphql-request');
module.exports = {
    1: {
        rpcUrl: "https://mainnet.infura.io/v3/3947c045ca5a4d68bff484fb038fb11c",
        linkedChainId: 137,
        requestUrl: "https://api.thegraph.com/subgraphs/name/aquiladev/uns",
        client: new GraphQLClient("https://api.thegraph.com/subgraphs/name/aquiladev/uns"),
    },
    5: {
        rpcUrl: "https://goerli.infura.io/v3/3947c045ca5a4d68bff484fb038fb11c",
        linkedChainId: 80001,
        requestUrl: "https://api.thegraph.com/subgraphs/name/aquiladev/uns-goerli",
        client: new GraphQLClient("https://api.thegraph.com/subgraphs/name/aquiladev/uns-goerli"),
    },
    137: {
        rpcUrl: "https://polygon-mainnet.infura.io/v3/3947c045ca5a4d68bff484fb038fb11c",
        linkedChainId: 1,
        requestUrl: "https://api.thegraph.com/subgraphs/name/aquiladev/uns-polygon",
        client: new GraphQLClient("https://api.thegraph.com/subgraphs/name/aquiladev/uns-polygon"),
    },
    80001: {
        rpcUrl: "https://polygon-mumbai.infura.io/v3/3947c045ca5a4d68bff484fb038fb11c",
        linkedChainId: 5,
        requestUrl: "https://api.thegraph.com/subgraphs/name/aquiladev/uns-mumbai",
        client: new GraphQLClient("https://api.thegraph.com/subgraphs/name/aquiladev/uns-mumbai"),
    },
}