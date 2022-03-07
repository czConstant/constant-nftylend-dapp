import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { SolletExtensionWalletAdapter, SolletWalletAdapter } from '@solana/wallet-adapter-sollet';
import { Coin98WalletAdapter } from '@solana/wallet-adapter-coin98';
import { FC, useMemo } from 'react';

export const SolanaWalletProvider: FC = (props) => {
  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you want to instantiate here will be compiled into your application
  const wallets = useMemo(() => {
    return [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new Coin98WalletAdapter(),
    ];
  }, []);

  return (
    <WalletProvider wallets={wallets}>
      <WalletModalProvider>{props.children}</WalletModalProvider>
    </WalletProvider>
  );
};

export const useSolanaWallet = useWallet;
