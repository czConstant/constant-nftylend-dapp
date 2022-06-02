import React from "react";
import cx from "classnames";

import styles from "./styles.module.scss";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
}

const SectionContainer = (props: SectionContainerProps) => {
  const { className, children } = props;

  return (
    <div className={cx(className, styles.sectionContainer)}>
      <div>{children}</div>
    </div>
  );
};

export default SectionContainer;
