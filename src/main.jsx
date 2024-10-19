// import React from 'react'
// import UniSwap from './components/UniSwap';

// // Aseguramos que el Custom Element se registre solo una vez
// if (!customElements.get('uniswap-enchainte')) {
//   window.customElements.define('uniswap-enchainte', UniSwap);
// }
import './i18n'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import WinerySelector from './components/WinerySelector/WinerySelector';
import { ThirdwebProvider } from 'thirdweb/react';
import AppProvider from './context';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <AppProvider>
        
        <App />
      </AppProvider>
    </ThirdwebProvider>

  </React.StrictMode>
);