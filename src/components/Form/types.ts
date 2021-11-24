export type Value = string | null | undefined;
export type Error = string | null | undefined;

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

export type FieldBlockDeclaration = {
  readonly label?: string;
  readonly direction: Direction;
  readonly fields: FieldDeclaration[];
};

export type FormConfig = {
  readonly direction: Direction;
  readonly blocks: FieldBlockDeclaration[];
};

export type OnChangeHandler = (name: FieldDeclaration['name'], value: Value) => void;
export type OnBlurHandler = (name: FieldDeclaration['name']) => void;
