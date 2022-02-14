import type { ReactNode } from 'react';

type Scalar = string | number;
type Tuple = Scalar[];
type TupleList = Tuple[];
type FormValue = Scalar | TupleList;

export type FormValues = { [key: string]: FormValue };

export type Values<TFormValues extends FormValues> = Partial<TFormValues>;

export type ErrorMessage = string;

export enum ControlType {
  INPUT = 'input',
  SELECT = 'select',
  LIST = 'list',
}

export enum DataType {
  TEXT = 'text',
  NUMBER = 'number',
}

export enum Width {
  THIRD = 'third',
  QUARTER = 'quarter',
  HALF = 'half',
  TWO_THIRDS = 'two-thirds',
  THREE_QUARTERS = 'three-quarters',
  FULL = 'full',
}

type Validator<TFormValues extends FormValues, TFieldName extends keyof TFormValues> = (
  value: TFormValues[TFieldName] | undefined,
  values: Values<TFormValues>
) => ErrorMessage | null | void;

type ValuesBasedBoolean<TFormValues extends FormValues> = (values: Values<TFormValues>) => boolean;

type IsRequired<
  TFormValues extends FormValues,
  TFieldName extends keyof TFormValues
> = TFormValues[TFieldName] extends NonNullable<TFormValues[TFieldName]>
  ? true
  : boolean | ValuesBasedBoolean<TFormValues>;

type IsDisabled<TFormValues extends FormValues> = boolean | ValuesBasedBoolean<TFormValues>;

type ListTupleType<T extends unknown[][]> = T extends (infer TupleType)[] ? TupleType : never;

type TypeDataType<T> = T extends unknown[][]
  ? TypeDataType<ListTupleType<T>>
  : T extends unknown[]
  ? { [Index in keyof T]: TypeDataType<T[Index]> }
  : T extends number
  ? DataType.NUMBER
  : T extends string
  ? DataType.TEXT
  : never;

type InputFieldDeclaration<TFormValues extends FormValues, TFieldName extends keyof TFormValues> = {
  readonly controlType: ControlType.INPUT;
  readonly dataType: TypeDataType<TFormValues[TFieldName]>;
  readonly helperText?: string;
  readonly initialValue?: TFormValues[TFieldName];
  readonly isDisabled?: IsDisabled<TFormValues>;
  readonly isRequired?: IsRequired<TFormValues, TFieldName>;
  readonly label: string;
  readonly name: string & TFieldName;
  readonly prefix?: ReactNode;
  readonly suffix?: ReactNode;
  readonly validate?: Validator<TFormValues, TFieldName>;
  readonly width?: Width;
};

type SelectOption = {
  readonly label: string;
  readonly value: string;
};

type SelectFieldDeclaration<
  TFormValues extends FormValues,
  TFieldName extends keyof TFormValues
> = {
  readonly controlType: ControlType.SELECT;
  readonly dataType: TypeDataType<TFormValues[TFieldName]>;
  readonly helperText?: string;
  readonly isDisabled?: IsDisabled<TFormValues>;
  readonly isRequired?: IsRequired<TFormValues, TFieldName>;
  readonly initialValue?: TFormValues[TFieldName];
  readonly label: string;
  readonly name: string & TFieldName;
  readonly options: SelectOption[];
  readonly validate?: Validator<TFormValues, TFieldName>;
  readonly width?: Width;
};

type TupleListFieldDeclaration<
  TFormValues extends FormValues,
  TFieldName extends keyof TFormValues
> = {
  readonly controlType: ControlType.LIST;
  readonly dataTypes: TypeDataType<TFormValues[TFieldName]>;
  readonly fields?: string[];
  readonly helperText?: string;
  readonly initialValue?: TFormValues[TFieldName];
  readonly isDisabled?: IsDisabled<TFormValues>;
  readonly isRequired?: IsRequired<TFormValues, TFieldName>;
  readonly label: string;
  readonly name: string & TFieldName;
  readonly separator?: ReactNode;
  readonly validate?: Validator<TFormValues, TFieldName>;
  readonly width?: Width;
};

export type FieldDeclaration<
  TFormValues extends FormValues,
  TFieldName extends keyof TFormValues
> =
  | InputFieldDeclaration<TFormValues, TFieldName>
  | SelectFieldDeclaration<TFormValues, TFieldName>
  | TupleListFieldDeclaration<TFormValues, TFieldName>;

export type Fields<TFormValues extends FormValues> = {
  [TFieldName in keyof TFormValues]?: FieldDeclaration<TFormValues, TFieldName>;
};
