import Box from '@material-ui/core/Box';
import type { FC } from 'react';

import Flex from '../Flex';

import Field from './Field';
import FieldSet from './FieldSet';
import {
  Direction,
  Error,
  FieldDeclaration,
  BlockDeclaration,
  OnBlurHandler,
  OnChangeHandler,
  Value,
} from './types';

type FieldName = string;

type FieldBlockProps = {
  readonly block: BlockDeclaration | FieldDeclaration;
  readonly values: Record<FieldName, Value>;
  readonly errors: Record<FieldName, Error>;
  readonly onChangeField: OnChangeHandler;
  readonly onBlurField: OnBlurHandler;
};

const isFieldDeclaration = (
  block: FieldDeclaration | BlockDeclaration
): block is FieldDeclaration => !!(block as FieldDeclaration).name;

const FieldBlock: FC<FieldBlockProps> = ({ block, values, errors, onChangeField, onBlurField }) => {
  if (isFieldDeclaration(block)) {
    return (
      <Box mb={1} flexGrow={1}>
        <Field
          {...block}
          error={errors[block.name]}
          value={values[block.name]}
          onChange={onChangeField}
          onBlur={onBlurField}
          fullWidth
        />
      </Box>
    );
  }

  const blocks = (
    <Flex
      flexDirection={block.direction === Direction.HORIZONTAL ? 'row' : 'column'}
      gap={5}
      flexGrow={1}
    >
      {block.blocks.map((subBlock, index) => (
        <FieldBlock
          key={index}
          block={subBlock}
          values={values}
          errors={errors}
          onChangeField={onChangeField}
          onBlurField={onBlurField}
        />
      ))}
    </Flex>
  );

  if (block.label) {
    return (
      <Box flexGrow={1}>
        <FieldSet direction={block.direction} label={block.label}>
          {blocks}
        </FieldSet>
      </Box>
    );
  }

  return blocks;
};

export default FieldBlock;
