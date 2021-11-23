export type Value = string | null | undefined;

export type FieldDeclaration = {
  readonly name: string;
  readonly required: boolean;
  readonly label: string;
  readonly helperText?: string;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly validate?: (value: string) => string | null;
};

export type FieldSetDeclaration = {
  readonly label: string;
  readonly fields: FieldDeclaration[];
};
