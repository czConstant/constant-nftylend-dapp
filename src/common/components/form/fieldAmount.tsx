import React, { useRef } from "react";
import Cleave from 'cleave.js/react';
import { Box, FormControl, FormErrorMessage, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';

import IconInfinity from "./images/infinity.svg";
import styles from "./styles.module.scss";

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
    decimals = 2,
    // disabledInput, errorPlacement, zIndex, anchorAppend,
    ...restProps
  } = props;
  const { onChange, onBlur, onFocus, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error) || (error && value);
  const hasAppend = appendComp || onClickMax;

  const isError = meta.error && meta.touched;

  return (
    <FormControl isInvalid={isError}>
      <InputGroup
        borderWidth={1}
        borderColor={shouldShowError ? 'brand.danger.400' : '#dedfe5'}
        borderRadius={8}
        bgColor='background.default'
        overflow='hidden'
      >
        {prependComp && (
          <InputLeftElement children={prependComp} />
        )}
        <Box className={styles.formControl}>
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
            options={{
              numeral: true,
              numeralThousandsGroupStyle: "thousand",
              numeralPositiveOnly: true,
              numeralDecimalScale: decimals,
            }}
            {...restProps}
          />
        </Box>
        {hasAppend && <InputRightElement w='fit-content' pr={2} children={appendComp} />}
      </InputGroup>
      <FormErrorMessage fontSize='sm' color='brand.danger.400'>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default FieldAmount;
