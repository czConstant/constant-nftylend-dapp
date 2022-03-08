import React from 'react';
import cx from 'classnames';

import Logo from 'src/assets/images/logo.svg';
import LogoDark from 'src/assets/images/logo-dark.svg';

import styles from './styles.module.scss';

interface AppIconProps {
  height?: number;
  className?: string;
  dark?: boolean;
}

const AppIcon = (props: AppIconProps) => {
  const { height = 25, className, dark } = props;

  return (
    <div className={cx(className, styles.wrapper)} style={{ height }}>
      <img alt="MyConstant" src={dark ? LogoDark : Logo} />
    </div>
  );
};

export default AppIcon;
