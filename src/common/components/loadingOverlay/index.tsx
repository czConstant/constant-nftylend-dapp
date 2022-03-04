import { useEffect } from 'react';
import cx from 'classnames';

import darkLoading from 'src/common/components/loading/json/dark.json';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { hideLoadingOverlay, selectLoadingOverlay } from 'src/store/loadingOverlay';

import LottiePlayer from '../lottiePlayer';
import styles from './styles.module.scss';

const LoadingOverlay = () => {
  const config = useAppSelector(selectLoadingOverlay);
  const { show, timeout = 0, callback } = config;
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if(show && timeout > 0) {
      setTimeout(() => {
        dispatch(hideLoadingOverlay());
        if (callback) callback();
      }, timeout);
    }
  }, [show]);

  return (
    <div className={cx(styles.loadingOverlay, show && styles.show)}>
      <div className={styles.spinner}>
        <LottiePlayer autoplay loop style={{ height: 60 }} src={darkLoading} />
      </div>
    </div>
  );
};

export default LoadingOverlay;