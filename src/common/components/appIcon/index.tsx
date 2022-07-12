import React from 'react';
import cx from 'classnames';

import Logo from 'src/assets/images/logo-text.png';
import LogoDark from 'src/assets/images/logo-text-dark.png';
import LogoParas from 'src/assets/images/logo-pawn-x-paras.png';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';

import styles from './styles.module.scss';

interface AppIconProps {
  height?: number;
  className?: string;
  dark?: boolean;
}

const AppIcon = (props: AppIconProps) => {
  const { height = 36, className, dark } = props;
  const { isFromParas } = useCurrentWallet()

  let logo = Logo
  if (isFromParas) logo = LogoParas

  return (
    <div className={cx(className, styles.wrapper)} style={{ height }}>
      <img alt="NFTPawn" src={logo} />
    </div>
  );
};

export default AppIcon;
