import React, { memo } from "react";

import styles from "./styles.module.scss";

interface WrapperProps {}

const Wrapper: React.FC<WrapperProps> = (props) => {
  const { children } = props;
  return (
    <div className={styles.container}>
      <div>{children}</div>
    </div>
  );
};

export default memo(Wrapper);
