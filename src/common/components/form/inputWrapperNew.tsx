import React from 'react';
import cx from 'classnames';
import { FormControl, FormLabel } from '@chakra-ui/react';

import InfoTooltip from 'src/common/components/infoTooltip';

interface InputWrapperProps {
  label?: string | React.ReactNode;
  desc?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  theme?: 'light' | 'dark'
}

const InputWrapper = (props: InputWrapperProps) => {
  const { label, desc, children, theme } = props;

  return (
    <FormControl>
      {label && (
        <FormLabel>
          {label} {desc && <InfoTooltip label={desc} />}
        </FormLabel>
      )}
      {children}
    </FormControl>
  );
};

export default InputWrapper;