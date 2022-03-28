import { memo } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import cx from 'classnames';

import { clearWallet, selectNftyLend } from 'src/store/nftyLend';

import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import styles from './styles.module.scss';
import { closeModal, openModal } from 'src/store/modal';
import ConnectWalletModal from '../connectWalletModal';

interface ButtonConnectWalletProps {
  className?: string;
}

const ButtonConnectWallet = (props: ButtonConnectWalletProps) => {
  const { className } = props;
  const dispatch = useAppDispatch();

  const onClick = () => {
    const id = 'connectWalletModal';
    const close = () => dispatch(closeModal({ id }))
    dispatch(openModal({
      id,
      theme: 'dark',
      modalProps: {
        centered: true,
        contentClassName: styles.modalContent,
      },
      render: () => <ConnectWalletModal onClose={close} />,
    }))
  };

  return (
    <Button className={cx(styles.connectButton, className)} onClick={onClick}>
      Connect wallet
    </Button>
  );
};

export default memo(ButtonConnectWallet);
