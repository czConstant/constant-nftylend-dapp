import React, { useEffect } from 'react';
import cx from 'classnames';

import darkLoading from 'src/common/components/loading/json/dark.json';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { hideLoadingOverlay, selectLoadingOverlay } from 'src/store/loadingOverlay';

import BgMascot from './background.json';
import Mascot from './mascot.gif';
import LottiePlayer from '../lottiePlayer';
import styles from './styles.module.scss';

interface MyLoadingOverlayProps {
  active?: boolean;
  children?: React.ReactNode;
  message?: string;
  show?: boolean;
  spinner?: React.ReactNode;
  timeout?: number;
  callback?: Function;
}

const MyLoadingOverlay = (props: MyLoadingOverlayProps) => {
  const { active = true, children, message, spinner, timeout = 0, callback } = props;
  const dispatch = useAppDispatch();
  const show = useAppSelector(selectLoadingOverlay).show;
  
  useEffect(() => {
    if(show && timeout > 0) {
      setTimeout(() => {
        dispatch(hideLoadingOverlay());
        if (callback) callback();
      }, timeout);
    }
  }, [show]);

  const defaulSpinner = () => {
    return (
      <LottiePlayer autoplay loop style={{ height: 60 }} src={darkLoading} />
    );
  };

  return (
    <div className={cx(styles.loadingOverlay, show && styles.show)}>
      {/* <LoadingOverlay
        active={active}
        spinner={spinner || defaulSpinner()}
        text={message}
      >
        {children}
      </LoadingOverlay> */}      
      <div className={styles.inner}>
        <LottiePlayer className={styles.bg} autoplay loop style={{ height: 300 }} src={BgMascot} />
        <img alt="" src={Mascot} />
      </div>
    </div>
  );
};

export default MyLoadingOverlay;