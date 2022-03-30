import { useAppSelector } from 'src/store/hooks';
import { selectCurrentWallet, selectNftyLend, updateWallet } from 'src/store/nftyLend';

function useCurrentWallet() {
  const currentWallet = useAppSelector(selectCurrentWallet);

  return {
    currentWallet,
    isConnected: currentWallet.address && currentWallet.chain,
  };
};

export { useCurrentWallet };