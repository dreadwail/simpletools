import Box from '@material-ui/core/Box';
import Grid, { GridDirection, GridJustification, GridSize } from '@material-ui/core/Grid';
import { FC, useEffect, useMemo } from 'react';

import FieldSet from '../FieldSet';
import ListField from '../ListField';
import SelectField from '../SelectField';
import TextField from '../TextField';

import {
  Fields,
  FieldDeclaration,
  FormValues,
  Width,
  ControlType,
  FieldBooleans,
  DataType,
} from './types';
import useFormState, { FormState } from './useFormState';

export enum BlockDirection {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export enum BlockAlignment {
  START = 'start',
  CENTER = 'center',
  END = 'end',
}

export type BlockDeclaration<
  TFormValues extends FormValues,
  TFieldName extends keyof TFormValues = keyof TFormValues
> = {
  readonly direction?: BlockDirection;
  readonly alignment?: BlockAlignment;
  readonly width?: Width;
  readonly label?: string;
  readonly children: (
    | BlockDeclaration<TFormValues, TFieldName>
    | (TFieldName extends keyof TFormValues ? FieldDeclaration<TFormValues, TFieldName> : never)
  )[];
};

type BlockChild<
  TFormValues extends FormValues,
  TFieldName extends keyof TFormValues = keyof TFormValues
> = BlockDeclaration<TFormValues, TFieldName>['children'][number];

const isBlockDeclaration = <TFormValues extends FormValues, TFieldName extends keyof TFormValues>(
  suspect: BlockChild<TFormValues, TFieldName>
): suspect is BlockDeclaration<TFormValues, TFieldName> =>
  !!(suspect as BlockDeclaration<TFormValues, TFieldName>).children;

type OnFormChange<TFormValues extends FormValues> = (payload: {
  readonly values: Partial<TFormValues>;
  readonly errors: FieldBooleans<TFormValues>;
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

type FieldBlockProps<TFormValues extends FormValues> = FormState<TFormValues> & {
  readonly blockChild: BlockChild<TFormValues>;
};

const FieldBlock = <TFormValues extends FormValues>({
  blockChild,
  ...formState
}: FieldBlockProps<TFormValues>) => {
  if (!isBlockDeclaration(blockChild)) {
    return (
      <GridBlock isContainer={false} width={blockChild.width}>
        <Box my={GAP} mr={GAP}>
          {() => {
            switch (blockChild.controlType) {
              case ControlType.INPUT:
                return (
                  <TextField
                    hasError={formState.errors[blockChild.name]}
                    helperText={formState.helperTexts[blockChild.name]}
                    isDisabled={formState.isFieldDisabled(blockChild.name)}
                    isRequired={formState.isFieldRequired(blockChild.name)}
                    label={blockChild.label}
                    name={blockChild.name}
                    onBlur={() => formState.onBlur(blockChild.name)}
                    onChange={newValue => {
                      switch (blockChild.dataType) {
                        case DataType.NUMBER: {
                          formState.onChange(
                            blockChild.name,
                            parseFloat(newValue) as TFormValues[keyof TFormValues]
                          );
                          break;
                        }
                        default: {
                          formState.onChange(
                            blockChild.name,
                            newValue as TFormValues[keyof TFormValues]
                          );
                          break;
                        }
                      }
                    }}
                    prefix={blockChild.prefix}
                    suffix={blockChild.suffix}
                    value={`${formState.values[blockChild.name]}`}
                  />
                );
              case ControlType.SELECT:
                return (
                  <SelectField
                    hasError={formState.errors[blockChild.name]}
                    helperText={formState.helperTexts[blockChild.name]}
                    isDisabled={formState.isFieldDisabled(blockChild.name)}
                    isRequired={formState.isFieldRequired(blockChild.name)}
                    label={blockChild.label}
                    name={blockChild.name}
                    onBlur={() => formState.onBlur(blockChild.name)}
                    onChange={newValue => {
                      switch (blockChild.dataType) {
                        case DataType.NUMBER: {
                          formState.onChange(
                            blockChild.name,
                            parseFloat(newValue) as TFormValues[keyof TFormValues]
                          );
                          break;
                        }
                        default: {
                          formState.onChange(
                            blockChild.name,
                            newValue as TFormValues[keyof TFormValues]
                          );
                          break;
                        }
                      }
                    }}
                    options={blockChild.options}
                    value={`${formState.values[blockChild.name]}`}
                  />
                );
              case ControlType.LIST:
                return (
                  <ListField
                    fields={blockChild.fields}
                    hasError={formState.errors[blockChild.name]}
                    helperText={formState.helperTexts[blockChild.name]}
                    isDisabled={formState.isFieldDisabled(blockChild.name)}
                    isRequired={formState.isFieldRequired(blockChild.name)}
                    label={blockChild.label}
                    onBlur={() => formState.onBlur(blockChild.name)}
                    onChange={newValue => {
                      // TODO
                    }}
                    separator={blockChild.separator}
                    value={formState.values[blockChild.name] as string[][] | undefined}
                  />
                );
              default:
                return null;
            }
          }}
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
        <FieldBlock<TFormValues> key={index} blockChild={subBlock} {...formState} />
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

const Form = <TFormValues extends FormValues>({
  fields: block,
  onChange,
}: FormProps<TFormValues>) => {
  const fields = useMemo(() => extractFields(block), [block]);
  const formState = useFormState(fields);
  const { values, errors, helperTexts, isValid /* , onChange, onBlur */ } = formState;

  useEffect(() => {
    onChange({ values, errors, isValid });
  }, [onChange, values, errors, isValid]);

  return (
    <>
      <FieldBlock blockChild={block} {...formState} />
      <pre>{JSON.stringify({ values, errors, helperTexts, isValid }, null, 2)}</pre>
    </>
  );
};

export default Form;
