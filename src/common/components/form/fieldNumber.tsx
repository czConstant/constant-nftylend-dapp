import React, { ReactEventHandler, useRef, useState } from "react";
import cx from "classnames";
import { Box, Flex, FormErrorMessage, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';

// import ErrorOverlay from 'src/components/errorOverlay';
// import { useTextWidth } from '@tag0/use-text-width';

import IconInfinity from "./images/infinity.svg";
import styles from "./styles.module.scss";

interface FieldNumberProps {
  input?: any;
  meta?: any;
  label?: string;
  prependComp?: React.ReactNode;
  appendComp?: React.ReactNode;
  onClickMax?: React.MouseEventHandler;
  placeholder?: string;
}

const FieldNumber = (props: FieldNumberProps) => {
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
    // disabledInput, errorPlacement, zIndex, anchorAppend,
    ...restProps
  } = props;
  const { onChange, onBlur, onFocus, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error) || (error && value);
  const hasAppend = appendComp || onClickMax;

  const isError = meta.error && meta.touched;

  return (<>
    <InputGroup
      className={cx(
        styles.inputGroup,
        (isError || errorMessage) && styles.borderDanger
      )}
    >
      {prependComp && <InputLeftElement>{prependComp}</InputLeftElement>}
      <Input
        placeholder={placeholder}
        value={Number.parseFloat(value) || ""}
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
      {hasAppend && (
        <Flex>
          {onClickMax && (
              <div className={styles.maxText} onClick={onClickMax}>
                <img src={IconInfinity} alt="" />
              </div>
            )}
            {appendComp && <InputRightElement>{appendComp}</InputRightElement>}
        </Flex>
      )}
    </InputGroup>
    {isError && <FormErrorMessage>{error}</FormErrorMessage>}
  </>);
};

export default FieldNumber;
