import React from 'react';
import cx from 'classnames';

import styles from './styles.module.scss';
import MyPopover from '../myPopover';

interface InputWrapperProps {
  label?: string | React.ReactNode;
  desc?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const InputWrapper = (props: InputWrapperProps) => {
  const { className, label, desc, children } = props;

  return (
    <div className={cx(styles.inputWrapper, className)}>
      {label && (
        <div className={cx(styles.labelWrapper)}>
          <label>
            {label}
            {desc && <MyPopover desc={desc} />}
          </label>
        </div>
      )}
      {children}
    </div>
  );
};

export default InputWrapper;