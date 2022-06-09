import React, { memo, useRef, useState } from "react";
import { FormGroup, InputGroup, Overlay, Tooltip } from "react-bootstrap";
import DatePicker from "react-datepicker";
import cx from "classnames";
import styles from "./styles.module.scss";

import "react-datepicker/dist/react-datepicker.css";

interface FieldDateTimePickertProps {
  input?: any;
  meta?: any;
  label?: string;
  placeholder?: string;
  errorMessage?: any;
  errorPlacement?: string;
  inputType?: "text" | "textarea";
}

const FieldDateTimePicker = (props: FieldDateTimePickertProps) => {
  const {
    input,
    meta,
    label,
    placeholder,
    errorMessage,
    errorPlacement = "bottom",
    inputType = "text",
    // disabledInput, errorPlacement, zIndex, anchorAppend,
    ...restProps
  } = props;
  const { onChange, onBlur, onFocus, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error) || (error && value);
  const target = useRef(null);

  const _value = value || undefined;

  const isError = meta.error && meta.touched;

  return (
    <FormGroup ref={target} className={cx(styles.formGroup, "formGroup")}>
      <div className={styles.formControl} ref={target}>
        <DatePicker
          className={cx(
            shouldShowError && styles.borderDanger,
            styles.inputDatePicker
          )}
          onChange={(date: Date) => onChange(date)}
          selected={_value}
          dateFormat="yyyy/MM/dd h:mm aa"
          timeInputLabel="Time:"
          placeholderText={placeholder}
          {...restProps}
        />
      </div>
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

export default FieldDateTimePicker;
