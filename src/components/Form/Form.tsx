import { useEffect, useMemo } from 'react';

import type { ErrorMessage, Fields, FieldDeclaration, FormValues, Width } from './types';
import useFormState from './useFormState';

// import Box from '@material-ui/core/Box';
// import Grid, { GridDirection, GridJustification, GridSize } from '@material-ui/core/Grid';
// import type { FC } from 'react';
// import FieldSet from '../FieldSet';
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

export type BlockWidth = Width;

type BlockChild<TFormValues extends FormValues, TFieldName extends keyof TFormValues> =
  | BlockDeclaration<TFormValues, TFieldName>
  | FieldDeclaration<TFormValues, TFieldName>;

export type BlockDeclaration<
  TFormValues extends FormValues,
  TFieldName extends keyof TFormValues = keyof TFormValues
> = {
  readonly direction?: BlockDirection;
  readonly alignment?: BlockAlignment;
  readonly width?: BlockWidth;
  readonly label?: string;
  readonly children: BlockChild<TFormValues, TFieldName>[];
};

const isFieldDeclaration = <TFormValues extends FormValues>(
  suspect: BlockChild<TFormValues, keyof TFormValues>
): suspect is FieldDeclaration<TFormValues> => !!(suspect as FieldDeclaration<TFormValues>).name;

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
    if (!isFieldDeclaration(current)) {
      const toBuildFrom = current;
      return { ...memo, ...extractFields(toBuildFrom) };
    }
    return { ...memo, [current.name]: current };
  }, {});

const Form = <TFormValues extends FormValues>({
  fields: block,
  onChange,
}: FormProps<TFormValues>) => {
  const fields = useMemo(() => extractFields(block), [block]);
  const { values, errors, helperTexts, isValid /* , onChange, onBlur */ } = useFormState(fields);

  useEffect(() => {
    onChange({ values, errors, isValid });
  }, [onChange, values, errors, isValid]);

  return <pre>{JSON.stringify({ values, errors, helperTexts, isValid }, null, 2)}</pre>;
};

export default Form;

// type SizeableFieldProps = FieldProps & {
//   readonly width?: Width;
// };

// const cssJustifications: Record<Alignment, GridJustification> = {
//   [Alignment.START]: 'flex-start',
//   [Alignment.CENTER]: 'center',
//   [Alignment.END]: 'flex-end',
// };
//
// const getCssJustification = (alignment: Alignment = Alignment.START): GridJustification =>
//   cssJustifications[alignment] ?? 'flex-start';
//
// const GRID_MAX: GridSize = 12;
//
// type GridSizes = {
//   readonly xs: GridSize;
//   readonly sm?: GridSize;
//   readonly md?: GridSize;
//   readonly lg?: GridSize;
//   readonly xl?: GridSize;
// };
//
// const gridWidthSizes: Record<Width, GridSizes> = {
//   [Width.QUARTER]: { xs: GRID_MAX, sm: 3 },
//   [Width.THIRD]: { xs: GRID_MAX, sm: 4 },
//   [Width.HALF]: { xs: GRID_MAX, sm: 6 },
//   [Width.TWO_THIRDS]: { xs: GRID_MAX, sm: 8 },
//   [Width.THREE_QUARTERS]: { xs: GRID_MAX, sm: 9 },
//   [Width.FULL]: { xs: GRID_MAX },
// };
//
// const getGridSizes = (width: Width = Width.FULL): GridSizes =>
//   gridWidthSizes[width] ?? gridWidthSizes[Width.FULL];
//
// const cssDirections: Record<Direction, GridDirection> = {
//   [Direction.HORIZONTAL]: 'row',
//   [Direction.VERTICAL]: 'column',
// };
//
// const getCssDirection = (direction: Direction = Direction.VERTICAL): GridDirection =>
//   cssDirections[direction] ?? 'row';
//
// type GridBlockProps = {
//   readonly isContainer: boolean;
//   readonly width?: Width;
//   readonly alignment?: Alignment;
//   readonly direction?: Direction;
// };
//
// const GridBlock: FC<GridBlockProps> = ({
//   isContainer,
//   width = Width.FULL,
//   alignment = Alignment.START,
//   direction = Direction.HORIZONTAL,
//   children,
// }) => {
//   const gridSizes = getGridSizes(width);
//   const alignItems = isContainer ? 'flex-start' : undefined;
//   const flexDirection = isContainer ? getCssDirection(direction) : undefined;
//   const justifyContent = isContainer ? getCssJustification(alignment) : undefined;
//
//   return (
//     <Grid
//       container={isContainer}
//       item
//       alignItems={alignItems}
//       justifyContent={justifyContent}
//       direction={flexDirection}
//       xs={gridSizes.xs}
//       sm={gridSizes.sm}
//       md={gridSizes.md}
//       lg={gridSizes.lg}
//       xl={gridSizes.xl}
//     >
//       {children}
//     </Grid>
//   );
// };
//
// const GAP = 0.5;
//
// const FieldBlock = (props: FieldBlockProps) => {
//   if (isFieldBlockDeclaration(props)) {
//     return (
//       <GridBlock isContainer={false} width={props.width}>
//         <Box my={GAP} mr={GAP}>
//           <Field {...props.field} />
//         </Box>
//       </GridBlock>
//     );
//   }
//
//   const subBlocks = (
//     <GridBlock
//       isContainer
//       width={Width.FULL}
//       alignment={props.alignment}
//       direction={props.direction}
//     >
//       {props.blocks.map((subBlock, index) => (
//         <FieldBlock key={index} {...subBlock} />
//       ))}
//     </GridBlock>
//   );
//
//   if (props.label) {
//     return (
//       <GridBlock
//         isContainer
//         width={props.width}
//         alignment={props.alignment}
//         direction={props.direction}
//       >
//         <Box width="100%">
//           <FieldSet label={props.label} visualGap={GAP}>
//             {subBlocks}
//           </FieldSet>
//         </Box>
//       </GridBlock>
//     );
//   }
//
//   return (
//     <GridBlock
//       isContainer
//       width={props.width}
//       alignment={props.alignment}
//       direction={props.direction}
//     >
//       {subBlocks}
//     </GridBlock>
//   );
// };
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
