import React, { useRef } from "react";
import cx from "classnames";
import FormGroup from "react-bootstrap/FormGroup";
import InputGroup from "react-bootstrap/InputGroup";
import Cleave from 'cleave.js/react';

// import ErrorOverlay from 'src/components/errorOverlay';
// import { useTextWidth } from '@tag0/use-text-width';

import IconInfinity from "./images/infinity.svg";
import styles from "./styles.module.scss";
import ErrorOverlay from "../errorOverlay";
import { Overlay, OverlayTrigger, Tooltip } from "react-bootstrap";

interface FieldAmountProps {
  input?: any;
  meta?: any;
  label?: string;
  prependComp?: React.ReactNode;
  appendComp?: React.ReactNode;
  onClickMax?: React.MouseEventHandler;
  placeholder?: string;
  decimals?: number;
}

const FieldAmount = (props: FieldAmountProps) => {
  const {
    input,
    meta,
    label,
    prependComp,
    appendComp,
    onClickMax,
    placeholder = "0.0",
    errorMessage,
    errorPlacement = "bottom",
    decimals = 2,
    // disabledInput, errorPlacement, zIndex, anchorAppend,
    ...restProps
  } = props;
  const { onChange, onBlur, onFocus, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error) || (error && value);
  const target = useRef(null);
  const hasAppend = appendComp || onClickMax;

  const isError = meta.error && meta.touched;

  return (
    <FormGroup ref={target} className={styles.formGroup}>
      <InputGroup
        className={cx(
          styles.inputGroup,
          (isError || errorMessage) && styles.borderDanger
        )}
      >
        {prependComp && (
          <div className={cx(styles.groupPrepend)}>
            <InputGroup.Text>{prependComp}</InputGroup.Text>
          </div>
        )}
        <div className={styles.formControl} ref={target}>
          <Cleave
            placeholder={placeholder}
            value={value}
            maxLength={12}
            onChange={e => onChange(e.target.rawValue)}
            onFocus={onFocus}
            onBlur={(e) => {
              onBlur();
              e?.target?.blur();
            }}
            className={cx(shouldShowError && styles.borderDanger)}
            options={{
              numeral: true,
              numeralThousandsGroupStyle: "thousand",
              numeralPositiveOnly: true,
              numeralDecimalScale: 0,
            }}
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
      {isError && (
        <Overlay target={target.current} show={true} placement={errorPlacement}>
          {(props) => (
            <Tooltip className={styles.errorMessageWrap} id={error} {...props}>
              {error}
            </Tooltip>
          )}
        </Overlay>
      )}
    </FormGroup>
  );
};

export default FieldAmount;
