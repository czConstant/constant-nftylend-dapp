import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { selectNftBridge, updateSourceChain, updateSourceNft } from 'src/store/nftBridge';

import EthereumSignerKey from '../EthereumSignerKey';
import SolanaWalletKey from '../SolanaWalletKey';
import { CHAINS_WITH_NFT_SUPPORT, CHAIN_ID_SOLANA, isEVMChain } from '../../constant';
import ChainSelect from '../chainSelect';
import NftSelect from '../nftSelector';
import styles from './stepSource.module.scss';
import { NftItem } from '../nftSelector/selector';
import { useEthereumProvider } from '../../contexts/EthereumProviderContext';
import { useSolanaWallet } from 'src/common/contexts/SolanaWalletContext';

const StepSource = () => {
  const dispatch = useAppDispatch();
  const sourceChain = useAppSelector(selectNftBridge).sourceChain;

  const { signerAddress } = useEthereumProvider();
  const { publicKey } = useSolanaWallet();

  const isConnected = () => {
    if (!sourceChain) return false;
    if (isEVMChain(sourceChain.id)) return !!signerAddress;
    if (sourceChain.id === CHAIN_ID_SOLANA) return !!publicKey;
  }

  const onSelectChain = (id: string | null) => {
    const chain = CHAINS_WITH_NFT_SUPPORT.find(e => e.id === Number(id));
    if (chain) dispatch(updateSourceChain(chain));
  };

  const onSelectNft = (nft: NftItem) => {
    dispatch(updateSourceNft(nft));
  };

  const renderWarning = () => {
    if (!sourceChain) return;
    if (isEVMChain(sourceChain.id)) {
      return 'Only NFTs which implement ERC-721 are supported.';
    }
    if (sourceChain.id === CHAIN_ID_SOLANA) {
      return 'Only NFTs with a supply of 1 are supported.';
    }
    return '';
  }

  const renderWallet = () => {
    if (!sourceChain) return null;
    if (isEVMChain(sourceChain.id)) return <EthereumSignerKey />
    if (sourceChain.id === CHAIN_ID_SOLANA) return <SolanaWalletKey />;
    return null;
  };

  return (
    <div className={styles.stepSource}>
      <div className={styles.title}>
        <div>
          <div>Select an NFT to send through the Wormhole NFT Bridge.</div>
          <div className={styles.onlySupport}>{renderWarning()}</div>
        </div>
        <div className={styles.verifier}>NFT Origin Verifier</div>
      </div>
      <ChainSelect chains={CHAINS_WITH_NFT_SUPPORT} className={styles.chainSelect} onSelectChain={onSelectChain} />
      <div className={styles.connectWallet}>
        {renderWallet()}
      </div>
      {isConnected() && sourceChain && <NftSelect chain={sourceChain} onSelectNft={onSelectNft} />}
    </div>
  );
};

export default StepSource;