import DatePicker from "react-datepicker";
import { FormControl, FormErrorMessage } from '@chakra-ui/react';
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
  const { onChange, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error) || (error && value);

  const _value = value || undefined;

  const isError = meta.error && meta.touched;

  return (
    <FormControl isInvalid={isError}>
      <div className={styles.formControl}>
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
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default FieldDateTimePicker;
