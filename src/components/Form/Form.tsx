import Box from '@material-ui/core/Box';
import Grid, { GridDirection, GridJustification, GridSize } from '@material-ui/core/Grid';
import { FC, useEffect, useMemo } from 'react';

import FieldSet from '../FieldSet';

import { ErrorMessage, Fields, FieldDeclaration, FormValues, Width } from './types';
import useFormState, { FormState } from './useFormState';

// import type { FC } from 'react';
// import Field, { FieldProps } from './Field';
// import { BlockDeclaration, FormValues, Width, Direction, Alignment } from './types';
// import ListField, { ListFieldProps } from '../ListField';
// import SelectField, { SelectFieldProps } from '../SelectField';
// import TextField, { TextFieldProps } from '../TextField';
// import { ControlType } from './types';

export enum BlockDirection {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export enum BlockAlignment {
  START = 'start',
  CENTER = 'center',
  END = 'end',
}

// type DistributiveOmit<T, K extends keyof T> = T extends unknown
//     ? Omit<T, K>
//     : never;

// type BlockChild<
//   TFormValues extends FormValues,
//   TFieldName = never
// > = TFieldName extends keyof TFormValues
//   ? FieldDeclaration<TFormValues, TFieldName>
//   : BlockDeclaration<TFormValues>;

export type BlockDeclaration<TFormValues extends FormValues, TFieldName = keyof TFormValues> = {
  readonly direction?: BlockDirection;
  readonly alignment?: BlockAlignment;
  readonly width?: Width;
  readonly label?: string;
  readonly children: (
    | BlockDeclaration<TFormValues, TFieldName>
    | (TFieldName extends keyof TFormValues ? FieldDeclaration<TFormValues, TFieldName> : never)
  )[];
};

type BlockChild<TFormValues extends FormValues, TFieldName = keyof TFormValues> = BlockDeclaration<
  TFormValues,
  TFieldName
>['children'][number];

const isBlockDeclaration = <TFormValues extends FormValues, TFieldName>(
  suspect: BlockChild<TFormValues, TFieldName>
): suspect is BlockDeclaration<TFormValues, TFieldName> =>
  !!(suspect as BlockDeclaration<TFormValues, TFieldName>).children;

type Errors<TFormValues extends FormValues> = {
  [TFieldName in keyof TFormValues]?: ErrorMessage;
};

type OnFormChange<TFormValues extends FormValues> = (payload: {
  readonly values: Partial<TFormValues>;
  readonly errors: Errors<TFormValues>;
  readonly isValid: boolean;
}) => void;

export type FormProps<TFormValues extends FormValues> = {
  readonly fields: BlockDeclaration<TFormValues>;
  readonly onChange: OnFormChange<TFormValues>;
};

const extractFields = <TFormValues extends FormValues>(
  block: BlockDeclaration<TFormValues>
): Fields<TFormValues> =>
  block.children.reduce<Fields<TFormValues>>((memo, current) => {
    if (isBlockDeclaration(current)) {
      const toBuildFrom = current;
      return { ...memo, ...extractFields(toBuildFrom) };
    }
    return { ...memo, [current.name]: current };
  }, {});

const cssJustifications: Record<BlockAlignment, GridJustification> = {
  [BlockAlignment.START]: 'flex-start',
  [BlockAlignment.CENTER]: 'center',
  [BlockAlignment.END]: 'flex-end',
};

const getCssJustification = (alignment: BlockAlignment = BlockAlignment.START): GridJustification =>
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

const cssDirections: Record<BlockDirection, GridDirection> = {
  [BlockDirection.HORIZONTAL]: 'row',
  [BlockDirection.VERTICAL]: 'column',
};

const getCssDirection = (direction: BlockDirection = BlockDirection.VERTICAL): GridDirection =>
  cssDirections[direction] ?? 'row';

type GridBlockProps = {
  readonly isContainer: boolean;
  readonly width?: Width;
  readonly alignment?: BlockAlignment;
  readonly direction?: BlockDirection;
};

const GridBlock: FC<GridBlockProps> = ({
  isContainer,
  width = Width.FULL,
  alignment = BlockAlignment.START,
  direction = BlockDirection.HORIZONTAL,
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

// type SizeableFieldProps = FieldProps & {
//   readonly width?: Width;
// };

type FieldBlockProps<TFormValues extends FormValues> = {
  readonly blockChild: BlockChild<TFormValues>;
  readonly values: FormState<TFormValues>['values'];
  readonly errors: FormState<TFormValues>['errors'];
  readonly helperTexts: FormState<TFormValues>['helperTexts'];
  // readonly onChangeField: FieldProps<TType, keyof TType>['onChangeField'];
  // readonly onBlurField: FieldProps<TType, keyof TType>['onBlurField'];
};

const FieldBlock = <TFormValues extends FormValues>({
  blockChild,
  values,
  errors,
  helperTexts,
}: FieldBlockProps<TFormValues>) => {
  if (!isBlockDeclaration(blockChild)) {
    return (
      <GridBlock isContainer={false} width={blockChild.width}>
        <Box my={GAP} mr={GAP}>
          field '{blockChild.name}' here
          {/* <Field {...props.field} /> */}
        </Box>
      </GridBlock>
    );
  }

  const subBlocks = (
    <GridBlock
      isContainer
      width={Width.FULL}
      alignment={blockChild.alignment}
      direction={blockChild.direction}
    >
      {blockChild.children.map((subBlock, index) => (
        <FieldBlock<TFormValues>
          key={index}
          blockChild={subBlock}
          values={values}
          errors={errors}
          helperTexts={helperTexts}
        />
      ))}
    </GridBlock>
  );

  if (blockChild.label) {
    return (
      <GridBlock
        isContainer
        width={blockChild.width}
        alignment={blockChild.alignment}
        direction={blockChild.direction}
      >
        <Box width="100%">
          <FieldSet label={blockChild.label} visualGap={GAP}>
            {subBlocks}
          </FieldSet>
        </Box>
      </GridBlock>
    );
  }

  return (
    <GridBlock
      isContainer
      width={blockChild.width}
      alignment={blockChild.alignment}
      direction={blockChild.direction}
    >
      {subBlocks}
    </GridBlock>
  );
};
//
//     case ControlType.INPUT:
//       return (
//         <TextField
//     case ControlType.SELECT:
//       return (
//         <SelectField
//     case ControlType.LIST:
//       return (
//         <ListField

const Form = <TFormValues extends FormValues>({
  fields: block,
  onChange,
}: FormProps<TFormValues>) => {
  const fields = useMemo(() => extractFields(block), [block]);
  const { values, errors, helperTexts, isValid /* , onChange, onBlur */ } = useFormState(fields);

  useEffect(() => {
    onChange({ values, errors, isValid });
  }, [onChange, values, errors, isValid]);

  return (
    <>
      <FieldBlock blockChild={block} values={values} errors={errors} helperTexts={helperTexts} />
      <pre>{JSON.stringify({ values, errors, helperTexts, isValid }, null, 2)}</pre>
    </>
  );
};

export default Form;
