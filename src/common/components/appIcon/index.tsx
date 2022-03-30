import React from 'react';
import cx from 'classnames';

import Logo from 'src/assets/images/logo.svg';
import LogoDark from 'src/assets/images/logo-text-dark.png';

import styles from './styles.module.scss';

interface AppIconProps {
  height?: number;
  className?: string;
  dark?: boolean;
}

const AppIcon = (props: AppIconProps) => {
  const { height = 36, className, dark } = props;

  return (
    <div className={cx(className, styles.wrapper)} style={{ height }}>
      <img alt="NFTPawn" src={dark ? LogoDark : Logo} />
    </div>
  );
};

export default AppIcon;
