import React, { useState } from "react";
import cx from "classnames";
import styles from "./styles.module.scss";
import { Accordion, Collapse } from "react-bootstrap";
import expandIco from "./assets/expand-arrow.svg";

interface SectionCollapseProps {
  label: string;
  id: string;
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
  id,
}) => {
  return (
    <Accordion
      alwaysOpen={selected}
      defaultActiveKey={selected && [id]}
      className={styles.sectionWrap}
    >
      <Accordion.Item eventKey={id}>
        <Accordion.Header className={disabled && styles.btnDisabled}>
          {label}
        </Accordion.Header>
        <Accordion.Body className={styles.tabContentWrap}>
          <div className={styles.content}>{content}</div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

SectionCollapse.defaultProps = {
  selected: false,
  disabled: false,
};

export default SectionCollapse;
