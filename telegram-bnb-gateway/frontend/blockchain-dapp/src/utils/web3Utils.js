import Web3 from 'web3';

const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

export const getBalance = async (address) => {
  return await web3.eth.getBalance(address);
};

export const sendTransaction = async (privateKey, recipient, amount, tokenAddress) => {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  const tx = {
    from: account.address,
    to: tokenAddress || recipient,
    value: tokenAddress ? '0x0' : web3.utils.toWei(amount, 'ether'),
    gas: tokenAddress ? 100000 : 21000,
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
  return await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
};
