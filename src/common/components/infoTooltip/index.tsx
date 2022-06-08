import { Icon, PlacementWithLogical, ResponsiveValue, Text, Tooltip } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { MdInfoOutline } from 'react-icons/md';

interface InfoTooltipProps {
  label: ReactNode;
  children?: ReactNode;
  placement?: PlacementWithLogical;
  iconSize?: string;
  fontSize?: string;
}

const InfoTooltip = (props: InfoTooltipProps) => {
  const { label, fontSize, iconSize, placement = 'top', children } = props;
  return (
    <Tooltip fontSize={fontSize} placement={placement} closeOnClick={false} label={label}>
      {children || <Text><Icon fontSize={iconSize} as={MdInfoOutline} /></Text>}
    </Tooltip>
  )
};

export default InfoTooltip;