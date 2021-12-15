import type { ReactNode } from 'react';

export type SingleValue = string;
export type TupleValue = SingleValue[];
export type ListValue = TupleValue[];

export type Value = SingleValue | ListValue;

export type Values<TFieldName extends string> = { [key in TFieldName]?: Value };
export type Errors<TFieldName extends string> = { [key in TFieldName]?: string };
export type Touched<TFieldName extends string> = { [key in TFieldName]?: boolean };

export enum Direction {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}
export enum Width {
  THIRD = 'third',
  QUARTER = 'quarter',
  HALF = 'half',
  TWO_THIRDS = 'two-thirds',
  THREE_QUARTERS = 'three-quarters',
  FULL = 'full',
}

export enum Alignment {
  START = 'start',
  CENTER = 'center',
  END = 'end',
}

export enum ControlType {
  INPUT,
  SELECT,
  LIST,
}

type FieldDeclarationBase<TFieldName extends string, TValue extends Value> = {
  readonly name: TFieldName;
  readonly label: string;
  readonly width?: Width;
  readonly isRequired?: boolean | ((values: Values<TFieldName>) => boolean);
  readonly isDisabled?: boolean | ((values: Values<TFieldName>) => boolean);
  readonly helperText?: string;
  readonly initialValue?: TValue;
  readonly validate?: (
    value: TValue,
    values: Values<TFieldName>
  ) => string | null | undefined | void;
};

export type InputFieldDeclaration<TFieldName extends string> = FieldDeclarationBase<
  TFieldName,
  SingleValue
> & {
  readonly controlType: ControlType.INPUT;
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
  readonly controlType: ControlType.SELECT;
  readonly options: SelectOption[];
};

export type TupleListFieldDeclaration<TFieldName extends string> = FieldDeclarationBase<
  TFieldName,
  ListValue
> & {
  readonly controlType: ControlType.LIST;
  readonly fields?: string[];
  readonly separator?: ReactNode;
};

export type FieldDeclaration<TFieldName extends string> =
  | InputFieldDeclaration<TFieldName>
  | SelectFieldDeclaration<TFieldName>
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
