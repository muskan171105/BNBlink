import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./pages/App.js"

function BNBLink() {
  // State to manage wallet address
  const [walletAddress, setWalletAddress] = useState("");

  const handleAddressChange = (e) => {
    setWalletAddress(e.target.value);
  };

  return (
    <div className="container">
      <div className="card p-4">
        <h1 className="text-center mb-4">BNBLink</h1>
        <div className="mb-3">
          <h4>Wallet</h4>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Wallet Address"
              value={walletAddress}
              onChange={handleAddressChange}
            />
          </div>
          <button className="btn btn-primary mt-2 w-100">Connect Wallet</button>
          <p className="mt-2">
            Balance: <strong>0.5 ETH</strong>
          </p>
        </div>

        <hr />

        <div className="mb-4">
          <h4>Transfer Funds</h4>
          <div className="row g-2">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Sender Wallet Address"
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Recipient Wallet Address"
              />
            </div>
            <div className="col-md-2">
              <input type="number" className="form-control" placeholder="Amount" />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Token Contract Address (optional)"
              />
            </div>
            <div className="col-md-1">
              <button className="btn btn-primary w-100">Send</button>
            </div>
          </div>
        </div>

        <hr />

        <div>
          <h4>Transaction History</h4>
          <p>No transactions yet.</p>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<BNBLink />, document.getElementById("root"));
