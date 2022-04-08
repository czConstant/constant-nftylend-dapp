import { CryptoWallet } from '../constants/wallet';

import IconMetamask from 'src/assets/images/wallet/metamask.svg';
import IconBinanceWallet from 'src/assets/images/wallet/binance-wallet.png';
import IconCoinbaseWallet from 'src/assets/images/wallet/coinbase-wallet.png';

const walletIcons = {
  [CryptoWallet.Metamask]: IconMetamask,
  [CryptoWallet.BinanceWallet]: IconBinanceWallet,
  [CryptoWallet.CoinbaseWallet]: IconCoinbaseWallet,
}

export default walletIcons;