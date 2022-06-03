import { memo } from 'react';
import { Button } from 'react-bootstrap';
import cx from 'classnames';

import { useAppDispatch } from 'src/store/hooks';
import styles from './styles.module.scss';
import { closeModal, openModal } from 'src/store/modal';
import DialogConnectWallet from '../dialogConnectWallet';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';

interface ButtonConnectWalletProps {
  className?: string;
  onClick?: Function;
}

const ButtonConnectWallet = (props: ButtonConnectWalletProps) => {
  const { className, onClick } = props;
  const { connectNearWallet } = useCurrentWallet();
  const dispatch = useAppDispatch();

  const handleClick = async () => {
    if (onClick) onClick();
    await connectNearWallet();
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
    <Button className={cx(styles.connectButton, className)} onClick={handleClick}>
      Connect wallet
    </Button>
  );
};

export default memo(ButtonConnectWallet);
