import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import ModalManager from 'src/common/components/modal';
import LoadingOverlay from 'src/common/components/loadingOverlay';
import { SolanaWalletProvider } from 'src/common/contexts/SolanaWalletContext';

import AppRouter from './navigation';

export default function App() {
  return (
    <SolanaWalletProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <ModalManager />
      <ToastContainer />
      <LoadingOverlay />
    </SolanaWalletProvider>
  );
}