export type FieldName = string;

export type Value = string | null | undefined;
export type Error = string | null | undefined;

export type Values = Record<FieldName, Value>;
export type Errors = Record<FieldName, Error>;

export enum Direction {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export type FieldDeclaration = {
  readonly name: string;
  readonly required: boolean;
  readonly label: string;
  readonly helperText?: string;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly validate?: (value: string) => string | null;
};

export type BlockDeclaration = {
  readonly direction: Direction;
  readonly label?: string;
  readonly blocks: (FieldDeclaration | BlockDeclaration)[];
};

export type OnChangeHandler = (name: FieldDeclaration['name'], value: Value) => void;
export type OnBlurHandler = (name: FieldDeclaration['name']) => void;
