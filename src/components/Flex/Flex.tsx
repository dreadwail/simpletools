import Box, { BoxProps } from '@material-ui/core/Box';
import { style } from '@material-ui/system';
import type { FC } from 'react';
import styled from 'styled-components';

type FlexProps = BoxProps & {
  readonly gap: number | string;
};

const gapStyle = style({
  prop: 'gap',
  cssProperty: 'gap',
  themeKey: 'spacing',
});

const Flex: FC<FlexProps> = props => <Box display="flex" {...props} />;

const StyledFlex = styled(Flex)`
  ${gapStyle}
`;

export default StyledFlex;
