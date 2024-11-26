const Web3 = require('web3');
require('dotenv').config();

const web3 = new Web3(process.env.BNB_RPC_URL);

async function getBalance(address) {
    try {
        const balance = await web3.eth.getBalance(address);
        return web3.utils.fromWei(balance, 'ether');
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { getBalance };
