import React, { useState } from "react";
import cx from "classnames";
import styles from "./styles.module.scss";
import { Accordion, Collapse, useAccordionButton } from "react-bootstrap";
import expandIco from "./assets/expand-arrow.svg";
import { isMobile } from "react-device-detect";

interface SectionCollapseProps {
  label: string;
  id: string;
  selected?: boolean;
  content?: any;
  disabled?: boolean;
  onToggle?: (_: any) => void;
  bodyClassName?: string;
  className?: string;
}

const SectionCollapse: React.FC<SectionCollapseProps> = ({
  label,
  selected,
  onToggle,
  content,
  disabled,
  id,
  bodyClassName,
  className
}) => {
  const [active, setActive] = useState(selected);
  const decoratedOnClick = useAccordionButton(id, () =>
    setActive((_active) => !_active)
  );
  return (
    <Accordion
      alwaysOpen={selected}
      defaultActiveKey={selected && [id]}
      className={cx(isMobile && styles.mbSectionWrap, styles.sectionWrap, className)}
      onClick={decoratedOnClick}
    >
      <Accordion.Item eventKey={id}>
        <Accordion.Header className={disabled && styles.btnDisabled}>
          <div dangerouslySetInnerHTML={{ __html: label }} />
          <img
            src={expandIco}
            className={cx(
              active && styles.expandIconActive,
              styles.expandIcon
            )}
          />
        </Accordion.Header>
        <Accordion.Body className={cx(bodyClassName, styles.tabContentWrap)}>
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
