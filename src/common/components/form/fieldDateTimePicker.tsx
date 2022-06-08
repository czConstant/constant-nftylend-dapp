import React, { memo, useRef, useState } from "react";
import { FormGroup, InputGroup } from "react-bootstrap";
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
  const target = useRef(null);

  const _value = value || new Date();

  const isError = meta.error && meta.touched;

  return (
    <FormGroup ref={target} className={cx(styles.formGroup, "formGroup")}>
      <InputGroup
        className={cx(
          styles.inputGroup,
          "inputGroup",
          (isError || errorMessage) && styles.borderDanger
        )}
      >
        <DatePicker
          // className={styles.formControl}
          onChange={(date: Date) => onChange(date)}
          selected={_value}
        />
      </InputGroup>
    </FormGroup>
  );
};

export default FieldDateTimePicker;
