const BN = require('bn.js');
const ethers = require('ethers');

const tlds = [
    "coin",
    "crypto",
    "bitcoin",
    "blockchain",
    "dao",
    "nft",
    "888",
    "wallet",
    "x",
    "klever",
    "zil",
    "hi",
    "kresus",
    "polygon",
    "anime",
    "manga",
    "binanceus",
]

const NameToHex = (name) => {
    name = name ? name.trim().toLowerCase() : '';
    ensureSupportedTLD(name);
    return ethers.namehash(name)
}
const HexToToken = (hexString) => {
    if (hexString.startsWith('0x')) {
        hexString = hexString.slice(2);
    }
    return new BN(hexString, 16).toString(10);
}

const NameToToken = (name) => {
    name = name ? name.trim().toLowerCase() : '';
    ensureSupportedTLD(name);
    return HexToToken(ethers.namehash(name));
}


const TokenToHex = (token) => {
    const hexString = '0x' + (new BN(token).toString(16)).padStart(64, 0);
    return hexString;
}

function ensureSupportedTLD(domain) {
    if (!isSupportedTLD(domain)) {
        throw new Error('Domain is not supported', {
            domain,
        });
    }
}
const isSupportedTLD = (domain) => {
    return (
        tlds.includes(domain) ||
        (domain.indexOf('.') > 0 &&
            /^.{1,}\.(coin|crypto|bitcoin|blockchain|dao|nft|888|wallet|x|klever|zil|hi|kresus|polygon|anime|manga|binanceus)$/.test(domain) &&
            domain.split('.').every(v => !!v.length))
    );
}

module.exports = {
    TokenToHex,
    HexToToken,
    NameToToken,
    NameToHex,
    tlds
}