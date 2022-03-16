import { useRef } from 'react';
import cx from 'classnames';
import FormGroup from 'react-bootstrap/FormGroup';
import InputGroup from 'react-bootstrap/InputGroup';

// import ErrorOverlay from 'src/components/errorOverlay';
// import { useTextWidth } from '@tag0/use-text-width';

import styles from './styles.module.scss';
import { Overlay, Tooltip } from 'react-bootstrap';

interface FieldTextProps {
  input?: any;
  meta?: any;
  label?: string;
  placeholder?: string;
  errorMessage?: any;
  errorPlacement?: string;
}

const FieldText = (props: FieldTextProps) => {
  const {
    input,
    meta,
    label,
    placeholder,
    errorMessage,
    errorPlacement = 'bottom',
    // disabledInput, errorPlacement, zIndex, anchorAppend,
    ...restProps
  } = props;
  const { onChange, onBlur, onFocus, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error) || (error && value);
  const target = useRef(null);

  const isError = meta.error && meta.touched;

  return (
    <FormGroup ref={target} className={cx(styles.formGroup, 'formGroup')}>
      <InputGroup
        className={cx(
          styles.inputGroup,
          'inputGroup',
          (isError || errorMessage) && styles.borderDanger
        )}
      >
        <div className={styles.formControl} ref={target}>
          <input
            placeholder={placeholder}
            value={value}
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

export default FieldText;
