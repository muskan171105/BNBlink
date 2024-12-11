import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import ConnectWalletScreen from './components/ConnectWalletScreen';
import TransferTokensScreen from './components/TransferTokensScreen';
import TransactionHistoryScreen from './components/TransactionHistoryScreen';
import MarketAlertsScreen from './components/MarketAlertsScreen';
import PriceAlertsScreen from './components/PriceAlertsScreen';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomeScreen} />
        <Route path="/connect-wallet" component={ConnectWalletScreen} />
        <Route path="/transfer-tokens" component={TransferTokensScreen} />
        <Route path="/transaction-history" component={TransactionHistoryScreen} />
        <Route path="/market-alerts" component={MarketAlertsScreen} />
        <Route path="/price-alerts" component={PriceAlertsScreen} />
      </Switch>
    </Router>
  );
}

export default App;
