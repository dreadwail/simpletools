import type { ReactNode } from 'react';

export type SingleValue = string;
export type ListValue = string[];
export type TupleValue = [string, string];
export type TupleListValue = TupleValue[];

export type Value = SingleValue | ListValue | TupleListValue;

export type Values<TFieldName extends string> = { [key in TFieldName]?: Value };
export type Errors<TFieldName extends string> = { [key in TFieldName]?: string };
export type Touched<TFieldName extends string> = { [key in TFieldName]?: boolean };

export enum Direction {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

const cssDirections: Record<Direction, string> = {
  [Direction.HORIZONTAL]: 'row',
  [Direction.VERTICAL]: 'column',
};

export const getCssDirection = (direction: Direction = Direction.VERTICAL): string =>
  cssDirections[direction];

export enum Width {
  THIRD = 'third',
  QUARTER = 'quarter',
  HALF = 'half',
  TWO_THIRDS = 'two-thirds',
  THREE_QUARTERS = 'three-quarters',
  FULL = 'full',
}

const cssWidths: Record<Width, string> = {
  [Width.QUARTER]: '25%',
  [Width.THIRD]: '33.33%',
  [Width.HALF]: '50%',
  [Width.TWO_THIRDS]: '66.66%',
  [Width.THREE_QUARTERS]: '75%',
  [Width.FULL]: '100%',
};

export const getCssWidth = (width: Width = Width.FULL): string => cssWidths[width];

export enum Alignment {
  START = 'start',
  CENTER = 'center',
  END = 'end',
}

const cssJustifications: Record<Alignment, string> = {
  [Alignment.START]: 'flex-start',
  [Alignment.CENTER]: 'center',
  [Alignment.END]: 'flex-end',
};

export const getCssJustification = (alignment: Alignment = Alignment.CENTER): string =>
  cssJustifications[alignment];

export enum FieldType {
  TEXT,
  SELECT,
  LIST,
  TUPLE_LIST,
}

type FieldDeclarationBase<TFieldName extends string, TValue extends Value> = {
  readonly type: FieldType;
  readonly name: TFieldName;
  readonly label: string;
  readonly width?: Width;
  readonly isRequired?: boolean | ((values: Values<TFieldName>) => boolean);
  readonly helperText?: string;
  readonly initialValue?: TValue;
  readonly validate?: (
    value: TValue,
    values: Values<TFieldName>
  ) => string | null | undefined | void;
};

export type TextFieldDeclaration<TFieldName extends string> = FieldDeclarationBase<
  TFieldName,
  SingleValue
> & {
  readonly type: FieldType.TEXT;
  readonly prefix?: ReactNode;
  readonly suffix?: ReactNode;
};

export type SelectOption = {
  readonly label: string;
  readonly value: string;
};

export type SelectFieldDeclaration<TFieldName extends string> = FieldDeclarationBase<
  TFieldName,
  SingleValue
> & {
  readonly type: FieldType.SELECT;
  readonly options: SelectOption[];
};

export type ListFieldDeclaration<TFieldName extends string> = FieldDeclarationBase<
  TFieldName,
  ListValue
> & {
  readonly type: FieldType.LIST;
  readonly prefix?: ReactNode;
  readonly suffix?: ReactNode;
};

export type TupleListFieldDeclaration<TFieldName extends string> = FieldDeclarationBase<
  TFieldName,
  TupleListValue
> & {
  readonly type: FieldType.TUPLE_LIST;
  readonly fieldLabel1: string;
  readonly fieldLabel2: string;
  readonly separator?: ReactNode;
};

export type FieldDeclaration<TFieldName extends string> =
  | TextFieldDeclaration<TFieldName>
  | SelectFieldDeclaration<TFieldName>
  | ListFieldDeclaration<TFieldName>
  | TupleListFieldDeclaration<TFieldName>;

export type BlockDeclaration<TFieldName extends string> = {
  readonly direction?: Direction;
  readonly alignment?: Alignment;
  readonly width?: Width;
  readonly label?: string;
  readonly blocks: (FieldDeclaration<TFieldName> | BlockDeclaration<TFieldName>)[];
};

export const isBlockDeclaration = <TFieldName extends string>(
  block: FieldDeclaration<TFieldName> | BlockDeclaration<TFieldName>
): block is BlockDeclaration<TFieldName> =>
  Array.isArray((block as BlockDeclaration<TFieldName>).blocks);

export type OnChangeHandler<TFieldName extends string> = (name: TFieldName, value: Value) => void;

export type OnBlurHandler<TFieldName extends string> = (name: TFieldName) => void;
