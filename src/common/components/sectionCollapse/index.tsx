import React, { ReactNode, useState } from "react";
import cx from "classnames";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Flex, Image, Text } from '@chakra-ui/react';
import expandIco from "./assets/expand-arrow.svg";

interface SectionCollapseProps {
  label: ReactNode;
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

  const onChange = (i: number) => {
    setActive(!active);
    onToggle && onToggle(i === 0)
  }

  return (
    <Accordion
      allowMultiple
      allowToggle
      defaultIndex={selected ? 0 : undefined}
      onChange={onChange}
      className={className}
    >
      <AccordionItem border='none'>
        <AccordionButton p={4} pointerEvents={disabled ? 'none' : 'all'} alignItems='center' justifyContent='space-between'>
          <Box>{label}</Box>
          <Image src={expandIco} transition='all 0.2s' transform={`rotate(${active ? '-180' : '0'}deg)`} />
        </AccordionButton>
        <AccordionPanel bgColor='background.card'>
          <Box>{content}</Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

SectionCollapse.defaultProps = {
  selected: false,
  disabled: false,
};

export default SectionCollapse;
