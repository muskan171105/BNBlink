const express = require("express");
const Web3 = require("web3");
const app = express();

// Initialize Web3 - connecting to a Binance Smart Chain node (e.g., BSC public RPC endpoint)
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org:443"));

// Sample endpoint to get wallet info
app.get("/wallet/:userId/info", (req, res) => {
  const userId = req.params.userId;
  
  // For simplicity, we assume the userId is their BSC wallet address (this can be modified as needed)
  const walletAddress = userId;  // In a real application, you would fetch the wallet address from a database
  
  // Respond with the wallet address
  res.json({ userId, walletAddress });
});

// Sample endpoint to check wallet balance
app.get("/wallet/:userId/balance", async (req, res) => {
  const userId = req.params.userId;
  
  // For simplicity, we assume the userId is the wallet address
  const walletAddress = userId;  // In a real application, you would fetch the wallet address from a database
  
  try {
    // Fetch the balance using Web3's `eth.getBalance` method (returns the balance in wei)
    const balanceWei = await web3.eth.getBalance(walletAddress);
    
    // Convert balance from wei to BNB (1 BNB = 10^18 wei)
    const balanceBNB = web3.utils.fromWei(balanceWei, 'ether');
    
    // Respond with the balance in BNB
    res.json({ userId, balance: `${balanceBNB} BNB` });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ error: "Failed to fetch wallet balance" });
  }
});

app.listen(3001, () => console.log("Wallet service running on port 3001"));
