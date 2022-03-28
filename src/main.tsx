import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import store from 'src/store';
import 'src/common/styles/index.module.scss';
import App from './App';
import { SolanaWalletProvider } from './modules/solana/hooks/withWalletProvider';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <SolanaWalletProvider>
        <App />
      </SolanaWalletProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
