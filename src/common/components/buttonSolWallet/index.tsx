import { memo } from "react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import cx from "classnames";

import "@solana/wallet-adapter-react-ui/styles.css";
import styles from "./styles.module.scss";
import { useWallet } from "@solana/wallet-adapter-react";

interface ButtonSolWalletProps {
  className?: string;
  classNameDisconnect?: string;
  showBtnDisConnect?: boolean;
}

const ButtonSolWallet: React.FC<ButtonSolWalletProps> = (
  props: ButtonSolWalletProps
) => {
  const { className, showBtnDisConnect, classNameDisconnect } = props;
  const { publicKey } = useWallet();

  if (publicKey && showBtnDisConnect) {
    return (
      <WalletModalProvider className={styles.modalContainer}>
        <WalletDisconnectButton
          className={cx(classNameDisconnect, styles.button)}
        />
      </WalletModalProvider>
    );
  }

  return (
    <WalletModalProvider className={styles.modalContainer}>
      <WalletMultiButton className={cx(className, styles.button)} />
    </WalletModalProvider>
  );
};

ButtonSolWallet.defaultProps = {
  showBtnDisConnect: false,
};

export default memo(ButtonSolWallet);
