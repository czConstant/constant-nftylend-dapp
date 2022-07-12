import React from 'react';
import cx from 'classnames';

import Logo from 'src/assets/images/logo-text.png';
import LogoDark from 'src/assets/images/logo-text-dark.png';
import LogoParas from 'src/assets/images/logo-pawn-x-paras.png';

import styles from './styles.module.scss';
import { useCookies } from 'react-cookie';

interface AppIconProps {
  height?: number;
  className?: string;
  dark?: boolean;
}

const AppIcon = (props: AppIconProps) => {
  const { height = 36, className, dark } = props;
  const [cookie, setCookkie, removeCookie] = useCookies(['referral_code'])

  let logo = Logo
  if (cookie.referral_code === 'paras') logo = LogoParas

  return (
    <div className={cx(className, styles.wrapper)} style={{ height }}>
      <img alt="NFTPawn" src={logo} />
    </div>
  );
};

export default AppIcon;
