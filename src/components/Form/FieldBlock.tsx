import Box from '@material-ui/core/Box';
import Grid, { GridDirection, GridJustification, GridSize } from '@material-ui/core/Grid';
import type { FC } from 'react';

import FieldSet from '../FieldSet';

import Field, { FieldProps } from './Field';
import {
  Errors,
  FieldDeclaration,
  BlockDeclaration,
  Touched,
  Width,
  Direction,
  Alignment,
  isFieldDeclaration,
  FormShape,
} from './types';

export type FieldBlockProps<TType extends FormShape> = {
  readonly block: BlockDeclaration<TType> | FieldDeclaration<TType, keyof TType>;
  readonly values: Partial<TType>;
  readonly errors: Errors<TType>;
  readonly touched: Touched<TType>;
  readonly onChangeField: FieldProps<TType, keyof TType>['onChangeField'];
  readonly onBlurField: FieldProps<TType, keyof TType>['onBlurField'];
};

const cssJustifications: Record<Alignment, GridJustification> = {
  [Alignment.START]: 'flex-start',
  [Alignment.CENTER]: 'center',
  [Alignment.END]: 'flex-end',
};

const getCssJustification = (alignment: Alignment = Alignment.START): GridJustification =>
  cssJustifications[alignment] ?? 'flex-start';

const GRID_MAX: GridSize = 12;

type GridSizes = {
  readonly xs: GridSize;
  readonly sm?: GridSize;
  readonly md?: GridSize;
  readonly lg?: GridSize;
  readonly xl?: GridSize;
};

const gridWidthSizes: Record<Width, GridSizes> = {
  [Width.QUARTER]: { xs: GRID_MAX, sm: 3 },
  [Width.THIRD]: { xs: GRID_MAX, sm: 4 },
  [Width.HALF]: { xs: GRID_MAX, sm: 6 },
  [Width.TWO_THIRDS]: { xs: GRID_MAX, sm: 8 },
  [Width.THREE_QUARTERS]: { xs: GRID_MAX, sm: 9 },
  [Width.FULL]: { xs: GRID_MAX },
};

const getGridSizes = (width: Width = Width.FULL): GridSizes =>
  gridWidthSizes[width] ?? gridWidthSizes[Width.FULL];

const cssDirections: Record<Direction, GridDirection> = {
  [Direction.HORIZONTAL]: 'row',
  [Direction.VERTICAL]: 'column',
};

const getCssDirection = (direction: Direction = Direction.VERTICAL): GridDirection =>
  cssDirections[direction] ?? 'row';

type GridBlockProps = {
  readonly isContainer: boolean;
  readonly width?: Width;
  readonly alignment?: Alignment;
  readonly direction?: Direction;
};

const GridBlock: FC<GridBlockProps> = ({
  isContainer,
  width = Width.FULL,
  alignment = Alignment.START,
  direction = Direction.HORIZONTAL,
  children,
}) => {
  const gridSizes = getGridSizes(width);
  const alignItems = isContainer ? 'flex-start' : undefined;
  const flexDirection = isContainer ? getCssDirection(direction) : undefined;
  const justifyContent = isContainer ? getCssJustification(alignment) : undefined;

  return (
    <Grid
      container={isContainer}
      item
      alignItems={alignItems}
      justifyContent={justifyContent}
      direction={flexDirection}
      xs={gridSizes.xs}
      sm={gridSizes.sm}
      md={gridSizes.md}
      lg={gridSizes.lg}
      xl={gridSizes.xl}
    >
      {children}
    </Grid>
  );
};

const GAP = 0.5;

const FieldBlock = <TType extends FormShape>({
  block,
  values,
  errors,
  touched,
  onChangeField,
  onBlurField,
}: FieldBlockProps<TType>) => {
  if (isFieldDeclaration(block)) {
    const isRequired =
      typeof block.isRequired === 'boolean' ? block.isRequired : !!block.isRequired?.(values);
    const isDisabled =
      typeof block.isDisabled === 'boolean' ? block.isDisabled : !!block.isDisabled?.(values);

    return (
      <GridBlock isContainer={false} width={block.width}>
        <Box my={GAP} mr={GAP}>
          <Field
            {...block}
            isRequired={isRequired}
            isDisabled={isDisabled}
            hasBeenTouched={!!touched[block.name]}
            error={errors[block.name]}
            value={values[block.name]}
            onChangeField={onChangeField}
            onBlurField={onBlurField}
            visualGap={GAP}
          />
        </Box>
      </GridBlock>
    );
  }

  const subBlocks = (
    <GridBlock
      isContainer
      width={Width.FULL}
      alignment={block.alignment}
      direction={block.direction}
    >
      {block.blocks.map((subBlock, index) => (
        <FieldBlock
          key={index}
          block={subBlock}
          values={values}
          errors={errors}
          touched={touched}
          onChangeField={onChangeField}
          onBlurField={onBlurField}
        />
      ))}
    </GridBlock>
  );

  if (block.label) {
    return (
      <GridBlock
        isContainer
        width={block.width}
        alignment={block.alignment}
        direction={block.direction}
      >
        <Box width="100%">
          <FieldSet label={block.label} visualGap={GAP}>
            {subBlocks}
          </FieldSet>
        </Box>
      </GridBlock>
    );
  }

  return (
    <GridBlock
      isContainer
      width={block.width}
      alignment={block.alignment}
      direction={block.direction}
    >
      {subBlocks}
    </GridBlock>
  );
};

export default FieldBlock;
