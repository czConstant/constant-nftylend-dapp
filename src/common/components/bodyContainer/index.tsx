import React from 'react';
import cx from 'classnames'

import styles from './styles.module.scss';

interface BodyContainerProps {
  children: React.ReactNode;
  className?: string;
}

const BodyContainer = (props: BodyContainerProps) => {
  const { className, children } = props;

  return (
    <div className={cx(styles.bodyContainer, className)}>
      <div>
        {children}
      </div>
    </div>
  );
};

export default BodyContainer;