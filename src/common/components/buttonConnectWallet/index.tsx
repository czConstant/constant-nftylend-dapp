import { memo } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

import { useAppDispatch } from 'src/store/hooks';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { closeModal, openModal } from 'src/store/modal';
import DialogConnectWallet from '../dialogConnectWallet';

const ButtonConnectWallet = (props: ButtonProps) => {
  const { className, onClick, ...rest } = props;
  const { connectNearWallet } = useCurrentWallet();
  const dispatch = useAppDispatch();

  const handleClick = async (e) => {
    if (onClick) onClick(e);
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
    <Button className={className} onClick={handleClick} {...rest}>
      Connect wallet
    </Button>
  );
};

export default memo(ButtonConnectWallet);
