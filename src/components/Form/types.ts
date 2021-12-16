import type { ReactNode } from 'react';

export type Scalar = string | number;
export type Tuple = Scalar[];
export type TupleList = Tuple[];

export type FormShape = { [key: string]: Scalar | TupleList };

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
  value: TType[TFieldName],
  values: Partial<TType>
) => ErrorMessage | null | void;

// type FieldDeclarationBase<
//   TType extends FormShape,
//   TFieldName extends keyof TType,
//   TValueConstraint extends FormValue
// > = {
//   readonly name: TFieldName;
//   readonly initialValue?: TType[TFieldName] & TValueConstraint;
//   readonly validate?: Validator<TType, TFieldName, TValueConstraint>;
//   readonly label: string;
//   readonly width?: Width;
//   readonly isRequired?: boolean | ((values: Partial<TType>) => boolean);
//   readonly isDisabled?: boolean | ((values: Partial<TType>) => boolean);
//   readonly helperText?: string;
// };

export type InputFieldDeclaration<
  TType extends FormShape,
  TFieldName extends string & keyof TType
> = {
  readonly controlType: ControlType.INPUT;
  readonly helperText?: string;
  readonly initialValue?: TType[TFieldName];
  readonly isRequired?: boolean | ((values: Partial<TType>) => boolean);
  readonly isDisabled?: boolean | ((values: Partial<TType>) => boolean);
  readonly label: string;
  readonly name: TFieldName;
  readonly prefix?: ReactNode;
  readonly suffix?: ReactNode;
  readonly validate?: Validator<TType, TFieldName>;
  readonly width?: Width;
};

export type SelectOption = {
  readonly label: string;
  readonly value: string;
};

export type SelectFieldDeclaration<
  TType extends FormShape,
  TFieldName extends string & keyof TType
> = {
  readonly controlType: ControlType.SELECT;
  readonly options: SelectOption[];
  readonly name: TFieldName;
  readonly initialValue?: TType[TFieldName];
  readonly validate?: Validator<TType, TFieldName>;
  readonly label: string;
  readonly width?: Width;
  readonly isRequired?: boolean | ((values: Partial<TType>) => boolean);
  readonly isDisabled?: boolean | ((values: Partial<TType>) => boolean);
  readonly helperText?: string;
};

export type TupleListFieldDeclaration<
  TType extends FormShape,
  TFieldName extends string & keyof TType
> = {
  readonly controlType: ControlType.LIST;
  readonly fields?: string[];
  readonly separator?: ReactNode;
  readonly name: TFieldName;
  readonly initialValue?: TType[TFieldName];
  readonly validate?: Validator<TType, TFieldName>;
  readonly label: string;
  readonly width?: Width;
  readonly isRequired?: boolean | ((values: Partial<TType>) => boolean);
  readonly isDisabled?: boolean | ((values: Partial<TType>) => boolean);
  readonly helperText?: string;
};

export type FieldDeclaration<TType extends FormShape, TFieldName extends string & keyof TType> =
  | InputFieldDeclaration<TType, TFieldName>
  | SelectFieldDeclaration<TType, TFieldName>
  | TupleListFieldDeclaration<TType, TFieldName>;

export type BlockDeclaration<TType extends FormShape> = {
  readonly direction?: Direction;
  readonly alignment?: Alignment;
  readonly width?: Width;
  readonly label?: string;
  readonly blocks: (FieldDeclaration<TType, string & keyof TType> | BlockDeclaration<TType>)[];
};

export const isBlockDeclaration = <TType extends FormShape>(
  block: FieldDeclaration<TType, string & keyof TType> | BlockDeclaration<TType>
): block is BlockDeclaration<TType> => Array.isArray((block as BlockDeclaration<TType>).blocks);
