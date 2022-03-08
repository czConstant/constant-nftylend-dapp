import React, { useState } from "react";
import cx from "classnames";
import styles from "./styles.module.scss";
import { Accordion, Collapse } from "react-bootstrap";
import expandIco from "./assets/expand-arrow.svg";

interface SectionCollapseProps {
  label: string;
  selected?: boolean;
  content?: any;
  disabled?: boolean;
  onToggle?: (_: any) => void;
}

const SectionCollapse: React.FC<SectionCollapseProps> = ({
  label,
  selected,
  onToggle,
  content,
  disabled,
}) => {
  return (
    <Accordion alwaysOpen={selected} className={styles.sectionWrap}>
      <Accordion.Header>{label}</Accordion.Header>
      <Accordion.Body className={styles.tabContentWrap}>
        <div className={styles.content}>{content}</div>
      </Accordion.Body>
    </Accordion>
  );
};

SectionCollapse.defaultProps = {
  selected: false,
  disabled: false,
};

export default SectionCollapse;
