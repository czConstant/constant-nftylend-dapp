import { memo, useEffect, useState } from 'react';
import cx from 'classnames';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text, Icon } from '@chakra-ui/react';

import { useAppDispatch } from 'src/store/hooks';
import { formatCurrency, shortCryptoAddress } from 'src/common/utils/format';
import { Chain } from 'src/common/constants/network';
import { toastSuccess } from 'src/common/services/toaster';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import tokenIcons from 'src/common/utils/tokenIcons';
import { closeModal, openModal } from 'src/store/modal';
import DialogConnectWallet from 'src/common/components/dialogConnectWallet';
import walletIcons from 'src/common/utils/walletIcons';
import DialogSettingNotification from 'src/common/components/dialogSettingNotification';

import IconMyAsset from './images/ic_my_assets.svg'
import IconChange from './images/ic_change_wallet.svg'
import IconCopy from './images/ic_copy_address.svg'
import IconDisconnect from './images/ic_disconnect.svg'
import styles from './styles.module.scss';
import { APP_URL } from 'src/common/constants/url';
import { useToken } from 'src/modules/nftLend/hooks/useToken';
import { MdDashboard, MdSettings } from 'react-icons/md';

interface ButtonWalletDropdownProps {
  className?: string;
}

const ButtonWalletDropdown = (props: ButtonWalletDropdownProps) => {
  const { className } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isConnected, currentWallet, disconnectWallet } = useCurrentWallet();
  const { getNativeBalance } = useToken();

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (isConnected) {
      getNativeBalance().then(res => setBalance(res));
    };
  }, [currentWallet]);

  const onChangeWallet = () => {
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
    window.nearSelector?.show();
  };

  const onEnableNotification = () => {
    const id = 'addEmailModal';
    const close = () => dispatch(closeModal({ id }))
    dispatch(openModal({
      id,
      theme: 'dark',
      title: 'Settings',
      modalProps: {
        centered: true,
        contentClassName: styles.modalContent,
      },
      render: () => <DialogSettingNotification onClose={close} />,
    }))
  };

  return (
    <Menu autoSelect={false} placement='bottom-end'>
      <MenuButton h='40px' borderRadius={20} fontWeight='semibold'>
        <Flex alignItems='center' p={4}>
          {/* {walletIcons[currentWallet.name] && <img alt="" src={walletIcons[currentWallet.name]} />} */}
          <Text className={styles.address} color='text.secondary'>
            {shortCryptoAddress(currentWallet.address, 10)} |
            &nbsp;
          </Text>
          <Text mr={4}>
            {formatCurrency(balance)} {currentWallet.chain.toString()}
          </Text>
          <Image alt="" src={tokenIcons[currentWallet.chain.toLowerCase()]} w='36px' h='36px' borderRadius={20} mr={-4} />
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => navigate(APP_URL.DASHBOARD)}>
          <Icon mr={2} boxSize='20px' color='text.secondary' as={MdDashboard} />
          <Text>Dashboard</Text>
        </MenuItem>
        <MenuItem>
          <CopyToClipboard
            onCopy={() => toastSuccess("Copied address!")}
            text={currentWallet.address}
          >
            <Flex>
              <Image boxSize='20px' src={IconCopy} mr={2} />
              <Text>Copy Address</Text>
            </Flex>
          </CopyToClipboard>
        </MenuItem>
        <MenuItem onClick={onEnableNotification}>
          <Icon mr={2} boxSize='20px' color='text.secondary' as={MdSettings} />
          <Text>Settings</Text>
        </MenuItem>
        <MenuItem onClick={onChangeWallet}>
          <Image boxSize='20px' src={IconChange} mr={2} />
          <Text>Change Wallet</Text>
        </MenuItem>
        <MenuItem onClick={disconnectWallet}>
          <Image boxSize='20px' src={IconDisconnect} mr={2} />
          <Text>Disconnect</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default memo(ButtonWalletDropdown);
