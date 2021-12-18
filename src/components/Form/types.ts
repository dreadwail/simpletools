import type { ReactNode } from 'react';

export type Scalar = string | number;
export type Tuple = Scalar[];
export type TupleList = Tuple[];
export type FormValue = Scalar | TupleList;

export type FormShape = { [key: string]: FormValue };

export type ErrorMessage = string;
export type Errors<TType extends FormShape> = { [key in keyof TType]?: ErrorMessage };

export type Touched<TType extends FormShape> = { [key in keyof TType]?: boolean };

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

type Validator<TType extends FormShape, TFieldName extends keyof TType> = (
  value: Partial<TType>[TFieldName],
  values: Partial<TType>
) => ErrorMessage | null | void;

/*
make it so that if a field is non-optional in TS, must be required (and optional may or may not)
make the declaration of a field on its own work nicely
make the declaration of a block with contained fields work nicely
*/

// type GetFirstArgumentOfAnyFunction<T> = T extends (
//   first: infer FirstArgument,
//   ...args: any[]
// ) => any
//   ? FirstArgument
//   : never

export type InputFieldDeclaration<TType extends FormShape, TFieldName extends keyof TType> = {
  readonly controlType: ControlType.INPUT;
  readonly helperText?: string;
  readonly initialValue?: TType[TFieldName];
  readonly isDisabled?: boolean | ((values: Partial<TType>) => boolean);
  readonly isRequired?: boolean | ((values: Partial<TType>) => boolean);
  readonly label: string;
  readonly name: string & TFieldName;
  readonly prefix?: ReactNode;
  readonly suffix?: ReactNode;
  readonly validate?: Validator<TType, TFieldName>;
  readonly width?: Width;
};

export type SelectOption = {
  readonly label: string;
  readonly value: string;
};

export type SelectFieldDeclaration<TType extends FormShape, TFieldName extends keyof TType> = {
  readonly controlType: ControlType.SELECT;
  readonly helperText?: string;
  readonly isDisabled?: boolean | ((values: Partial<TType>) => boolean);
  readonly isRequired?: boolean | ((values: Partial<TType>) => boolean);
  readonly initialValue?: TType[TFieldName];
  readonly label: string;
  readonly name: string & TFieldName;
  readonly options: SelectOption[];
  readonly validate?: Validator<TType, TFieldName>;
  readonly width?: Width;
};

export type TupleListFieldDeclaration<TType extends FormShape, TFieldName extends keyof TType> = {
  readonly controlType: ControlType.LIST;
  readonly fields?: string[];
  readonly helperText?: string;
  readonly initialValue?: TType[TFieldName];
  readonly isDisabled?: boolean | ((values: Partial<TType>) => boolean);
  readonly isRequired?: boolean | ((values: Partial<TType>) => boolean);
  readonly label: string;
  readonly name: string & TFieldName;
  readonly separator?: ReactNode;
  readonly validate?: Validator<TType, TFieldName>;
  readonly width?: Width;
};

export type FieldDeclaration<TType extends FormShape, TFieldName extends keyof TType> =
  | InputFieldDeclaration<TType, TFieldName>
  | SelectFieldDeclaration<TType, TFieldName>
  | TupleListFieldDeclaration<TType, TFieldName>;

export type BlockDeclaration<TType extends FormShape> = {
  readonly direction?: Direction;
  readonly alignment?: Alignment;
  readonly width?: Width;
  readonly label?: string;
  readonly blocks: (FieldDeclaration<TType, keyof TType> | BlockDeclaration<TType>)[];
};

export const isFieldDeclaration = <TType extends FormShape, TFieldName extends keyof TType>(
  block: FieldDeclaration<TType, TFieldName> | BlockDeclaration<TType>
): block is FieldDeclaration<TType, TFieldName> =>
  !!(block as FieldDeclaration<TType, TFieldName>).name;
