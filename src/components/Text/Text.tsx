import Typography, { TypographyProps } from '@material-ui/core/Typography';
import { FC } from 'react';

export type TextProps = {
  readonly color?: TypographyProps['color'];
};

const Text: FC<TextProps> = ({ color, children }) => (
  <Typography variant="body1" color={color} paragraph>
    {children}
  </Typography>
);

export default Text;
