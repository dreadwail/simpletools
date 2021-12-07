import Typography, { TypographyProps } from '@material-ui/core/Typography';
import type { FC } from 'react';

type Level = 1 | 2 | 3 | 4 | 5 | 6;
type LevelElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const levelToElement: Record<Level, LevelElement> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export type HeadingProps = {
  readonly level: Level;
  readonly visualLevel?: Level;
  readonly color?: TypographyProps['color'];
  readonly gutterBottom?: TypographyProps['gutterBottom'];
};

const Heading: FC<HeadingProps> = ({
  level,
  visualLevel,
  color,
  gutterBottom = false,
  children,
}) => {
  const levelElement = levelToElement[level];
  const visualLevelElement = visualLevel ? levelToElement[visualLevel] : levelElement;

  return (
    <Typography
      component={levelElement}
      variant={visualLevelElement}
      color={color}
      gutterBottom={gutterBottom}
    >
      {children}
    </Typography>
  );
};

export default Heading;
