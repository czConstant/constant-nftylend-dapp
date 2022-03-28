import { Chain } from 'src/common/constants/network';
import tokenIcons from 'src/common/utils/tokenIcons';
import styles from './connectWallet.module.scss';

const NETWORKS = [
  { image: tokenIcons.sol, name: 'Solana', chain: Chain.Solana },
  { image: tokenIcons.matic, name: 'Polygon', chain: Chain.Polygon },
];

const ConnectWalletModal = props => {
  return (
    <div className={styles.connectWallet}>
      <h2>Connect wallet</h2>
      <div className={styles.content}>
        <div>Choose network</div>
        <div className={styles.networks}>
          {NETWORKS.map(e => (
            <div key={e.chain}>
              <img alt="" src={e.image} />
              <div>{e.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal;