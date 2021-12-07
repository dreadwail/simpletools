import Box from '@material-ui/core/Box';
import { FC, useMemo } from 'react';

import Flex from '../Flex';

import Field from './Field';
import FieldSet from './FieldSet';
import {
  getCssDirection,
  getCssJustification,
  getCssWidth,
  Errors,
  FieldDeclaration,
  BlockDeclaration,
  OnBlurHandler,
  OnChangeHandler,
  Touched,
  Width,
  Values,
} from './types';

type FieldBlockProps<TFieldName extends string> = {
  readonly block: BlockDeclaration<TFieldName> | FieldDeclaration<TFieldName>;
  readonly values: Values<TFieldName>;
  readonly errors: Errors<TFieldName>;
  readonly touched: Touched<TFieldName>;
  readonly onChangeField: OnChangeHandler<TFieldName>;
  readonly onBlurField: OnBlurHandler<TFieldName>;
};

const isFieldDeclaration = <TFieldName extends string>(
  block: FieldDeclaration<TFieldName> | BlockDeclaration<TFieldName>
): block is FieldDeclaration<TFieldName> => !!(block as FieldDeclaration<TFieldName>).name;

const GAP = 0.5;

const FieldBlock = <TFieldName extends string>({
  block,
  values,
  errors,
  touched,
  onChangeField,
  onBlurField,
}: FieldBlockProps<TFieldName>) => {
  const Wrapper: FC = useMemo(
    () =>
      ({ children }) =>
        (
          <Flex alignItems="flex-start" width={getCssWidth(block.width)} p={GAP}>
            {children}
          </Flex>
        ),
    [block.width]
  );

  if (isFieldDeclaration(block)) {
    const isRequired =
      typeof block.isRequired === 'boolean' ? block.isRequired : !!block.isRequired?.(values);
    const isDisabled =
      typeof block.isDisabled === 'boolean' ? block.isDisabled : !!block.isDisabled?.(values);

    return (
      <Wrapper>
        <Field
          {...block}
          isRequired={isRequired}
          isDisabled={isDisabled}
          hasBeenTouched={!!touched[block.name]}
          error={errors[block.name]}
          value={values[block.name]}
          onChangeField={onChangeField}
          onBlurField={onBlurField}
        />
      </Wrapper>
    );
  }

  const subBlocks = (
    <Flex
      flexDirection={getCssDirection(block.direction)}
      flexWrap="wrap"
      justifyContent={getCssJustification(block.alignment)}
      width={getCssWidth(Width.FULL)}
    >
      {block.blocks.map((subBlock, index) => (
        <FieldBlock
          key={index}
          block={subBlock}
          values={values}
          errors={errors}
          touched={touched}
          onChangeField={onChangeField}
          onBlurField={onBlurField}
        />
      ))}
    </Flex>
  );

  if (block.label) {
    return (
      <Wrapper>
        <Box width="100%">
          <FieldSet label={block.label}>{subBlocks}</FieldSet>
        </Box>
      </Wrapper>
    );
  }

  return <Wrapper>{subBlocks}</Wrapper>;
};

export default FieldBlock;
