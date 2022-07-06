import React from "react";
import cx from "classnames";
import { Box } from '@chakra-ui/react';
import { isMobile } from "react-device-detect";

import styles from "./styles.module.scss";

interface BodyContainerProps {
  children: React.ReactNode;
  className?: string;
}

const BodyContainer = (props: BodyContainerProps) => {
  const { className, children } = props;

  return (
    <Box className={cx(className, styles.bodyContainer)} bgColor='black'>
      <div>{children}</div>
    </Box>
  );
};

export default BodyContainer;
