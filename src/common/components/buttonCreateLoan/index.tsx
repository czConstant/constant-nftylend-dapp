import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Player } from "@lottiefiles/react-lottie-player";
import lfCards from "./assets/lt_cards.json";
import styles from "./styles.module.scss";
import { useDispatch } from "react-redux";
import { closeModal, openModal } from "src/store/modal";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import bgModal from "./assets/bg_modal.png";
import ButtonSolWallet from "../buttonSolWallet";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_URL } from "src/common/constants/url";
import Loading from "../loading";
import { getLinkSolScanAccount } from "src/common/utils/solana";
import { shortCryptoAddress } from "src/common/utils/format";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toastSuccess } from "src/common/services/toaster";

const ModalCreateLoan = ({ navigate, onClose, onCallBack }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const publicKey = wallet?.publicKey;

  const [hasLoan, setHasLoan] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNFTs();
  }, [publicKey?.toString()]);

  const fetchNFTs = async () => {
    if (!publicKey) return;
    try {
      setLoading(true);
      const nfts = await getParsedNftAccountsByOwner({
        publicAddress: publicKey.toString(),
        connection,
      });

      setHasLoan(nfts);
    } catch (error) {
      setHasLoan([]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    } else if (!publicKey) {
      return (
        <>
          <h4>Connect Your Wallet</h4>
          <div>
            Similar to other Dapp, the first thing is connecting your wallet to
            our Dapp to start and there are few options that you can manage to
            connect: Solflare, Sollet, Phantom, Sollet, Coin98 Wallet.
          </div>
          <ButtonSolWallet className={styles.btnConnect} />
        </>
      );
    } else if (hasLoan.length > 0) {
      return (
        <>
          <div>
            Your wallet has {hasLoan.length} NFT assets, please select one of
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
              href={`${getLinkSolScanAccount(publicKey.toString())}`}
            >
              {publicKey?.toString()}
            </a>
            <CopyToClipboard
              onCopy={() => toastSuccess("Copied address!")}
              text={publicKey?.toString()}
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

interface ButtonCreateLoanProps {
  hiddenIcon?: boolean;
  title?: string;
  onCallBack?: () => void;
}

const ButtonCreateLoan: React.FC<ButtonCreateLoanProps> = ({
  hiddenIcon,
  title,
  onCallBack
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useWallet();
  const publicKey = wallet?.publicKey;
  const [hasLoan, setHasLoan] = useState([]);

  const onOpenModal = () => {
    if (hasLoan.length > 0) {
      return navigate(APP_URL.NFT_LENDING_MY_NFT);
    }

    const close = () => dispatch(closeModal({ id: "createLoanModal" }));
    dispatch(
      openModal({
        id: "createLoanModal",
        modalProps: {
          centered: true,
          dialogClassName: "modal-no-padding",
          padding: 0,
          contentClassName: styles.modalContent,
        },
        render: () => <ModalCreateLoan onClose={close} navigate={navigate} onCallBack={onCallBack} />,
        theme: "dark",
      })
    );
  };

  useEffect(() => {
    fetchNFTs();
  }, [publicKey?.toString()]);

  const fetchNFTs = async () => {
    if (!publicKey) return;
    try {
      // setLoading(true);
      const nfts = await getParsedNftAccountsByOwner({
        publicAddress: publicKey.toString(),
        connection,
      });

      setHasLoan(nfts);
    } catch (error) {
      setHasLoan([]);
    } finally {
      // setLoading(false);
    }
  };

  if (location.pathname.includes(APP_URL.NFT_LENDING_MY_NFT)) return null;

  return (
    <Button onClick={onOpenModal} className={styles.container}>
      {!hiddenIcon && (
        <Player
          autoplay
          loop
          src={lfCards}
          style={{ height: "30px", width: "30px" }}
        />
      )}

      <span>{title || "Create Loan"}</span>
    </Button>
  );
};

export default ButtonCreateLoan;
