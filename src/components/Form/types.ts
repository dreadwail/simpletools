export type Value = string;
export type Error = string;

export type Values<TFieldName extends string> = { [key in TFieldName]?: Value };
export type Errors<TFieldName extends string> = { [key in TFieldName]?: Error };
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
}

type FieldDeclarationBase<TFieldName extends string> = {
  readonly type: FieldType;
  readonly name: TFieldName;
  readonly width?: Width;
  readonly isRequired?: boolean | ((values: Values<TFieldName>) => boolean);
  readonly label: string;
  readonly helperText?: string;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly initialValue?: Value;
  readonly validate?: (values: Values<TFieldName>) => Error | null | undefined | void;
};

export type TextFieldDeclaration<TFieldName extends string> = FieldDeclarationBase<TFieldName> & {
  readonly type: FieldType.TEXT;
  readonly transform?: (value: string) => string;
};

export type SelectOption = {
  readonly label: string;
  readonly value: string;
};

export type SelectFieldDeclaration<TFieldName extends string> = FieldDeclarationBase<TFieldName> & {
  readonly type: FieldType.SELECT;
  readonly options: SelectOption[];
};

export type FieldDeclaration<TFieldName extends string> =
  | TextFieldDeclaration<TFieldName>
  | SelectFieldDeclaration<TFieldName>;

export type BlockDeclaration<TFieldName extends string> = {
  readonly direction?: Direction;
  readonly alignment?: Alignment;
  readonly width?: Width;
  readonly label?: string;
  readonly blocks: (FieldDeclaration<TFieldName> | BlockDeclaration<TFieldName>)[];
};

export type OnChangeHandler<TFieldName extends string> = (
  name: FieldDeclaration<TFieldName>['name'],
  value: Value
) => void;
export type OnBlurHandler<TFieldName extends string> = (
  name: FieldDeclaration<TFieldName>['name']
) => void;
