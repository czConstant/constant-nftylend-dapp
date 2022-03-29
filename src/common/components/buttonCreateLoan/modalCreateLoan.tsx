import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { APP_URL } from "src/common/constants/url";
import { toastSuccess } from "src/common/services/toaster";
import { useToken } from 'src/modules/nftLend/hooks/useToken';
import { useAppSelector } from 'src/store/hooks';
import { selectNftyLend } from 'src/store/nftyLend';
import { AssetNft } from 'src/modules/nftLend/models/nft';
import { getLinkExplorerWallet } from 'src/modules/nftLend/utils';

import Loading from "../loading";
import ButtonConnectWallet from '../buttonConnectWallet';
import styles from "./styles.module.scss";

const ModalCreateLoan = ({ navigate, onClose, onCallBack }) => {
  const { getNftsByOwner } = useToken();
  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const walletChain = useAppSelector(selectNftyLend).walletChain;

  const [myNfts, setMyNfts] = useState<Array<AssetNft>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNFTs();
  }, [walletAddress]);

  const fetchNFTs = async () => {
    if (!walletAddress) return;
    try {
      setLoading(true);
      const nfts = await getNftsByOwner(walletAddress, walletChain);
      setMyNfts(nfts);
    } catch (error) {
      setMyNfts([]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    } else if (!walletAddress) {
      return (
        <>
          <h4>Connect Your Wallet</h4>
          <div>
            Similar to other Dapp, the first thing is connecting your wallet to
            our Dapp to start and there are few options that you can manage to
            connect: Solflare, Sollet, Phantom, Sollet, Coin98 Wallet.
          </div>
          <ButtonConnectWallet onClick={onClose} className={styles.btnConnect} />
        </>
      );
    } else if (myNfts.length > 0) {
      return (
        <>
          <div>
            Your wallet has {myNfts.length} NFT assets, please select one of
            them to start creating a loan order!
          </div>
          <Button
            onClick={() => {
              onClose();
              onCallBack?.();
              navigate(APP_URL.NFT_LENDING_MY_NFT);
            }}
            className={styles.btnConnect}
          >
            Go to my asset
          </Button>
        </>
      );
    } else {
      return (
        <>
          <div>
            Your wallet has no NFT to create a loan. Please consider our
            <a>Whitelisted Collections</a> to buy or deposit NFTs into your
            wallet.
          </div>
          <div className={styles.addressWrap}>
            <a
              target="_blank"
              href={`${getLinkExplorerWallet(walletAddress, walletChain)}`}
            >
              {walletAddress}
            </a>
            <CopyToClipboard
              onCopy={() => toastSuccess("Copied address!")}
              text={walletAddress}
            >
              <i className="far fa-copy" />
            </CopyToClipboard>
          </div>
        </>
      );
    }
  };

  return <div className={styles.modalContainer}>{renderContent()}</div>;
};

export default ModalCreateLoan;