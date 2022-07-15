import React, { memo } from "react";
import cx from "classnames";

import styles from "./styles.module.scss";

interface OranamentProps {}

const Oranament: React.FC<OranamentProps> = ({}) => {
  return <div className={cx(styles.container, "oranament-container")} />;
};

export default memo(Oranament);
