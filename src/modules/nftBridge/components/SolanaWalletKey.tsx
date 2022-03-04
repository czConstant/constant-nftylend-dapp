import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import cx from 'classnames';

interface SolanaWalletKeyProps {
  className?: string;
};

const SolanaWalletKey = (props: SolanaWalletKeyProps) => {
  const { className } = props;

  return (
    <div>
      <WalletModalProvider>
        <WalletMultiButton className={cx(className)} />
      </WalletModalProvider>
    </div>
  );
};

export default SolanaWalletKey;
