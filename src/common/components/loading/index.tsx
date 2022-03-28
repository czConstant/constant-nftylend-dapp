import React from 'react';
import cx from 'classnames';

import LottiePlayer from '../lottiePlayer';
import styles from './styles.module.scss';
import lightLoading from './json/light.json';
import darkLoading from './json/dark.json';
import lightDesktopLoading from './json/lightDesktop.json';
import darkDesktopLoading from './json/darkDesktop.json';

interface LoadingProps {
  height?: number;
  dark?: boolean;
  className?: string;
}

const Loading = (props: LoadingProps) => {
  const { height = 30, dark = true, className } = props;
  let src = dark ? darkDesktopLoading : lightDesktopLoading;

  return (
    <LottiePlayer
      autoplay
      loop
      style={{ height }}
      src={src}
      className={cx(styles.container, className)}
    />
  );
};

export default Loading;