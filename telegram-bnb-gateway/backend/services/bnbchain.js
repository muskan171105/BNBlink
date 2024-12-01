import Web3 from 'web3';

// Initialize Web3 for Binance Smart Chain
const web3 = new Web3('https://bsc-dataseed.binance.org/'); // BSC Mainnet RPC URL

// Function to fetch balance
const fetchBalance = async (walletAddress, tokenAddress = null) => {
  try {
    if (tokenAddress) {
      // BEP-20 Token Balance
      const ERC20_ABI = [
        {
          constant: true,
          inputs: [{ name: "_owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "balance", type: "uint256" }],
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "decimals",
          outputs: [{ name: "", type: "uint8" }],
          type: "function",
        },
      ];

      const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
      const tokenBalance = await tokenContract.methods.balanceOf(walletAddress).call();
      const decimals = await tokenContract.methods.decimals().call();
      return tokenBalance / Math.pow(10, decimals); // Formatted balance
    } else {
      // Native BNB Balance (using BSC network)
      const nativeBalance = await web3.eth.getBalance(walletAddress);
      return web3.utils.fromWei(nativeBalance, 'ether'); // Convert Wei to BNB
    }
  } catch (error) {
    console.error('Error fetching balance:', error.message);
    throw error;
  }
};

export default fetchBalance;
