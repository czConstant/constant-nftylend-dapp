import React, { ReactEventHandler, useRef, useState } from 'react';
import cx from 'classnames';
import FormGroup from 'react-bootstrap/FormGroup';
import InputGroup from 'react-bootstrap/InputGroup';

// import ErrorOverlay from 'src/components/errorOverlay';
// import { useTextWidth } from '@tag0/use-text-width';

import IconInfinity from './images/infinity.svg';
import styles from './styles.module.scss';

interface FieldAmountProps {
  input?: any;
  meta?: any;
  label?: string;
  prependComp?: React.ReactNode;
  appendComp?: React.ReactNode;
  onClickMax?: React.MouseEventHandler;
  placeholder?: string;
}

const FieldAmount = (props: FieldAmountProps) => {
  const {
    input, meta, label, prependComp, appendComp, onClickMax, placeholder='0.0',
    // disabledInput, errorPlacement, zIndex, anchorAppend,
    ...restProps
  } = props;
  const { onChange, onBlur, onFocus, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error) || (error && value);
  const target = useRef(null);
  const hasAppend = appendComp || onClickMax;
  // const [displayValue, setDisplayValue] = useState(placeholder);

  // const onChangeDisplayValue = (text) => {
  //   setDisplayValue(text);
  // };

  // let width = 20;
  // if (__CLIENT__) {
  //   width = useTextWidth({ text: displayValue || placeholder , font: '15px SFProDisplay' });
  // }
  // const appendPosition = width + 15;

  return (
    <FormGroup className={styles.formGroup}>
      <InputGroup className={styles.inputGroup}>
        {prependComp && (
          <div className={cx(styles.groupPrepend)}>
            <InputGroup.Text>{prependComp}</InputGroup.Text>
          </div>
        )}
        <div className={styles.formControl} ref={target}>
          <input
            placeholder={placeholder}
            value={Number.parseFloat(value) || ''}
            maxLength={12}
            onFocus={() => onFocus()}
            onBlur={(e) => {
              onBlur();
              e?.target?.blur();
            }}
            className={cx(shouldShowError && styles.borderDanger)}
            onChange={onChange}
            {...restProps}
          />
        </div>
        {hasAppend && (
          <div className={cx(styles.groupAppend)}>
            {onClickMax && (
              <div className={styles.maxText} onClick={onClickMax}>
                <img src={IconInfinity} alt="" />
              </div>
            )}
            {appendComp && <InputGroup.Text>{appendComp}</InputGroup.Text>}
          </div>
        )}
      </InputGroup>
      {/* <ErrorOverlay
        placement={errorPlacement}
        target={target}
        shouldShowError={shouldShowError}
        error={error}
        zIndex={zIndex}
      /> */}
    </FormGroup>
  );
};

export default FieldAmount;
