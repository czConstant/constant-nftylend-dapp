import { ChainInfo, isEVMChain, CHAIN_ID_SOLANA } from '../../constant';
import SolanaNftSelector from './SolanaNftSelector';
import EthereumNftSelector from './EthereumNftSelector';
import { OnSelectNft } from './selector';

interface NftSelectProps {
  chain: ChainInfo;
  className?: string;
  onSelectNft: OnSelectNft;
}

export default function NftSelect(props: NftSelectProps) {
  const { chain, className, onSelectNft } = props;

  if (!chain) return null;

  if (isEVMChain(chain.id)) return <EthereumNftSelector className={className} onSelectNft={onSelectNft} />
  if (chain.id === CHAIN_ID_SOLANA) return <SolanaNftSelector className={className} onSelectNft={onSelectNft} />;
  return null;
}
