import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { APP_URL } from "src/common/constants/url";
import { toastSuccess } from "src/common/services/toaster";
import { useToken } from 'src/modules/nftLend/hooks/useToken';
import { useAppSelector } from 'src/store/hooks';
import { selectCurrentWallet } from 'src/store/nftyLend';
import { AssetNft } from 'src/modules/nftLend/models/nft';
import { getLinkExplorerWallet } from 'src/modules/nftLend/utils';

import Loading from "../../../common/components/loading";
import ButtonConnectWallet from '../../../common/components/buttonConnectWallet';
import styles from "./styles.module.scss";
import { Box, Button, Heading, Text } from '@chakra-ui/react';

interface DialogGuideStartProps {
  navigate?: any;
  onClose?: Function;
  onGoToAsset?: Function;
}

const DialogGuideStart = (props: DialogGuideStartProps) => {
  const { onClose, onGoToAsset, navigate } = props;

  const { getNftsByOwner } = useToken();
  const currentWallet = useAppSelector(selectCurrentWallet);

  const [myNfts, setMyNfts] = useState<Array<AssetNft>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNFTs();
  }, [currentWallet]);

  const fetchNFTs = async () => {
    if (!currentWallet.address) return;
    try {
      setLoading(true);
      const nfts = await getNftsByOwner(currentWallet.address, currentWallet.chain);
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
    } else if (!currentWallet.address) {
      return (
        <>
          <Heading as='h4'>Connect Your Wallet</Heading>
          <Text my={8}>
            Similar to other Dapp, the first thing is connecting your wallet to
            our Dapp to start and there are few options that you can manage to
            connect: Solflare, Sollet, Phantom, Sollet, Coin98 Wallet.
          </Text>
          <ButtonConnectWallet w='100%' h={50} onClick={() => onClose && onClose()} />
        </>
      );
    } else if (myNfts.length > 0) {
      return (
        <>
          <Text>
            Your wallet has {myNfts.length} NFT assets, please select one of
            them to start creating a loan order!
          </Text>
          <Button
            w='100%'
            mt={4}
            onClick={() => {
              if (onClose) onClose();
              if (onGoToAsset) onGoToAsset();
              navigate(APP_URL.DASHBOARD);
            }}
          >
            Go to My Assets
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Text>
            Your wallet has no NFT to create a loan. Please consider our <a>Whitelisted Collections</a> to buy or deposit NFTs into your wallet.
          </Text>
          <div className={styles.addressWrap}>
            <a
              target="_blank"
              href={`${getLinkExplorerWallet(currentWallet.address, currentWallet.chain)}`}
            >
              {currentWallet.address}
            </a>
            <CopyToClipboard
              onCopy={() => toastSuccess("Copied address!")}
              text={currentWallet.address}
            >
              <i className="far fa-copy" />
            </CopyToClipboard>
          </div>
        </>
      );
    }
  };

  return <Box>{renderContent()}</Box>;
};

export default DialogGuideStart;