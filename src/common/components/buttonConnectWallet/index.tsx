import { memo } from "react";
import { Button, ButtonProps } from "@chakra-ui/react";

import { useAppDispatch } from "src/store/hooks";
import { useCurrentWallet } from "src/modules/nftLend/hooks/useCurrentWallet";
import { closeModal, openModal } from "src/store/modal";
import DialogConnectWallet from "../dialogConnectWallet";
import styles from "src/common/components/modal/styles.module.scss";
import { Chain } from "src/common/constants/network";
import { CryptoWallet } from "src/common/constants/wallet";
import { useLocation } from "react-router-dom";
import { MARKETPLACE } from "src/apps/marketplace/constants/url";

const ButtonConnectWallet = (props: ButtonProps) => {
  const { className, onClick, ...rest } = props;
  const { connectNearWallet, connectETHWallet } = useCurrentWallet();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleClick = async (e) => {
    if (onClick) onClick(e);
    if (location.pathname.includes(MARKETPLACE)) {
      await connectETHWallet();
    } else {
      await connectNearWallet();
    }

    // await connectETHWallet();
    // const id = 'connectWalletModal';
    // const close = () => dispatch(closeModal({ id }))
    // dispatch(openModal({
    //   id,
    //   theme: 'dark',
    //   modalProps: {
    //     centered: true,
    //     contentClassName: styles.modalContent,
    //   },
    //   render: () => <DialogConnectWallet onClose={close} />,
    // }))
  };

  return (
    <Button className={className} onClick={handleClick} {...rest}>
      Connect wallet
    </Button>
  );
};

export default memo(ButtonConnectWallet);
