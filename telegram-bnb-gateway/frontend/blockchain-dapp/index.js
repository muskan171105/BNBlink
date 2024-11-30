import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Optional: Import global styles
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Ensure 'root' is the ID in your public/index.html
);
