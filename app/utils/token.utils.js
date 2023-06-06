const BN = require('bn.js');

const convertTokenToHex = (token) => {
    const hexString = '0x' + (new BN(token).toString(16)).padStart(64, 0);
    return hexString;
}

const convertHexToToken = (tokenHash) => {
    return new BN(tokenHash).toString();
}

module.exports = {
    convertTokenToHex,
}