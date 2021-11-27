export type FieldName = string;

export type MaybeValue = string | null | undefined;
export type MaybeError = string | null | undefined;

export type Values = Record<FieldName, MaybeValue>;
export type Errors = Record<FieldName, MaybeError>;
export type Touched = Record<FieldName, boolean>;

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
}

type RelatedFieldOptions = {
  readonly values: Values;
  readonly errors: Errors;
};

type RelatedFieldUpdates = {
  readonly values?: Partial<Values>;
  readonly errors?: Partial<Errors>;
};

type ValidateOptions = {
  readonly value: string;
  readonly values: Values;
};

type FieldDeclarationBase = {
  readonly type: FieldType;
  readonly name: string;
  readonly width?: Width;
  readonly required: boolean;
  readonly label: string;
  readonly helperText?: string;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly initialValue?: MaybeValue;
  readonly validate?: (options: ValidateOptions) => MaybeError;
  readonly onTouch?: (options: RelatedFieldOptions) => RelatedFieldUpdates | void;
};

export type TextFieldDeclaration = FieldDeclarationBase & {
  readonly type: FieldType.TEXT;
  readonly transform?: (value: string) => string;
};

export type SelectOption = {
  readonly label: string;
  readonly value: string;
};

export type SelectFieldDeclaration = FieldDeclarationBase & {
  readonly type: FieldType.SELECT;
  readonly options: SelectOption[];
};

export type FieldDeclaration = TextFieldDeclaration | SelectFieldDeclaration;

export type BlockDeclaration = {
  readonly direction?: Direction;
  readonly alignment?: Alignment;
  readonly width?: Width;
  readonly label?: string;
  readonly blocks: (FieldDeclaration | BlockDeclaration)[];
};

export type OnChangeHandler = (name: FieldDeclaration['name'], value: MaybeValue) => void;
export type OnBlurHandler = (name: FieldDeclaration['name'], value: MaybeValue) => void;
