import { Box, FormControl, FormErrorMessage, FormLabel, InputGroup } from '@chakra-ui/react';

// import ErrorOverlay from 'src/components/errorOverlay';
// import { useTextWidth } from '@tag0/use-text-width';

import styles from "./styles.module.scss";

interface FieldTextProps {
  input?: any;
  meta?: any;
  label?: string;
  placeholder?: string;
  errorMessage?: any;
  errorPlacement?: string;
  inputType?: "text" | "textarea";
}

const FieldText = (props: FieldTextProps) => {
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

  const isError = meta.error && meta.touched;

  return (
    <FormControl variant='floating' isInvalid={isError}>
      <FormLabel>{label}</FormLabel>
      <InputGroup
        borderWidth={1}
        borderColor={shouldShowError ? 'brand.danger.400' : '#dedfe5'}
        borderRadius={8}
        bgColor='background.default'
        overflow='hidden'
      >
        <Box className={styles.formControl}>
          {inputType === "text" ? (
            <input
              placeholder={placeholder}
              value={value}
              onFocus={() => onFocus()}
              onBlur={onBlur}
              onChange={onChange}
              {...restProps}
            />
          ) : (
            <textarea
              placeholder={placeholder}
              value={value}
              onFocus={() => onFocus()}
              onBlur={onBlur}
              onChange={onChange}
              {...restProps}
            />
          )}
        </Box>
      </InputGroup>
      <FormErrorMessage fontSize='sm' color='brand.danger.400'>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default FieldText;
