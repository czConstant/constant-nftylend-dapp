import { CryptoWallet } from '../constants/wallet';

import IconMetamask from 'src/assets/images/wallet/metamask.svg';
import IconBinanceWallet from 'src/assets/images/wallet/binance-wallet.png';
import IconCoinbaseWallet from 'src/assets/images/wallet/coinbase-wallet.png';
import IconWalletConnect from 'src/assets/images/wallet/wallet-connect.svg';
import IconFrameWallet from 'src/assets/images/wallet/frame-wallet.svg';
import IconCloverWallet from 'src/assets/images/wallet/clover-wallet.png';

const walletIcons = {
  [CryptoWallet.Metamask]: IconMetamask,
  [CryptoWallet.BinanceWallet]: IconBinanceWallet,
  [CryptoWallet.CoinbaseWallet]: IconCoinbaseWallet,
  [CryptoWallet.WalletConnect]: IconWalletConnect,
  [CryptoWallet.FrameWallet]: IconFrameWallet,
  [CryptoWallet.CloverWallet]: IconCloverWallet,
}

export default walletIcons;