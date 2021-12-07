import Typography, { TypographyProps } from '@material-ui/core/Typography';
import type { FC } from 'react';

export type TextProps = {
  readonly color?: TypographyProps['color'];
  readonly paragraph?: TypographyProps['paragraph'];
};

const Text: FC<TextProps> = ({ color, paragraph = true, children }) => (
  <Typography variant="body1" color={color} paragraph={paragraph}>
    {children}
  </Typography>
);

export default Text;
