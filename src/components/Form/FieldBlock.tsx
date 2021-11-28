import Box from '@material-ui/core/Box';
import type { FC } from 'react';

import Flex from '../Flex';

import Field from './Field';
import FieldSet from './FieldSet';
import {
  getCssDirection,
  getCssJustification,
  getCssWidth,
  MaybeError,
  FieldDeclaration,
  BlockDeclaration,
  OnBlurHandler,
  OnChangeHandler,
  Width,
  MaybeValue,
} from './types';

type FieldName = string;

type FieldBlockProps = {
  readonly block: BlockDeclaration | FieldDeclaration;
  readonly values: Record<FieldName, MaybeValue>;
  readonly errors: Record<FieldName, MaybeError>;
  readonly touched: Record<FieldName, boolean>;
  readonly onChangeField: OnChangeHandler;
  readonly onBlurField: OnBlurHandler;
};

const isFieldDeclaration = (
  block: FieldDeclaration | BlockDeclaration
): block is FieldDeclaration => !!(block as FieldDeclaration).name;

const GAP = 0.5;

const FieldBlock: FC<FieldBlockProps> = ({
  block,
  values,
  errors,
  touched,
  onChangeField,
  onBlurField,
}) => {
  if (isFieldDeclaration(block)) {
    const isRequired =
      typeof block.isRequired === 'boolean' ? block.isRequired : !!block.isRequired?.(values);

    return (
      <Flex p={GAP} width={getCssWidth(block.width)}>
        <Field
          {...block}
          isRequired={isRequired}
          hasBeenTouched={touched[block.name]}
          error={errors[block.name]}
          value={values[block.name]}
          onChange={onChangeField}
          onBlur={onBlurField}
        />
      </Flex>
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
      <Flex width={getCssWidth(block.width)} p={GAP}>
        <Box width="100%">
          <FieldSet label={block.label}>{subBlocks}</FieldSet>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex width={getCssWidth(block.width)} p={GAP}>
      {subBlocks}
    </Flex>
  );
};

export default FieldBlock;
