import React from 'react';
import cx from 'classnames';

import styles from './styles.module.scss';
import InfoTooltip from '../infoTooltip';

interface InputWrapperProps {
  label?: string | React.ReactNode;
  desc?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  theme?: 'light' | 'dark'
}

const InputWrapper = (props: InputWrapperProps) => {
  const { className, label, desc, children, theme = 'dark' } = props;

  return (
    <div className={cx([styles.inputWrapper, className, theme === 'dark' && styles.inputWrapperDark])}>
      {/* {label && (
        <div className={cx(styles.labelWrapper, 'labelWrapper')}>
          <label>
            {label}
            {desc && <InfoTooltip label={desc} />}
          </label>
        </div>
      )} */}
      {children}
    </div>
  );
};

export default InputWrapper;