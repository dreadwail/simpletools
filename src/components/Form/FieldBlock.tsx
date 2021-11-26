import Box, { BoxProps } from '@material-ui/core/Box';
import type { FC } from 'react';
import styled from 'styled-components';

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
  Width,
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

type SizeableBoxProps = BoxProps & {
  readonly $width: BlockDeclaration['width'];
};

const GAP = '5px';

const cssWidths: Record<Width, string> = {
  [Width.QUARTER]: '25%',
  [Width.THIRD]: '33.33%',
  [Width.HALF]: '50%',
  [Width.TWO_THIRDS]: '66.66%',
  [Width.THREE_QUARTERS]: '75%',
  [Width.FULL]: '100%',
};

const SizeableBox = styled(Box)<SizeableBoxProps>`
  width: ${props => cssWidths[props.$width]};
`;

const FieldBlock: FC<FieldBlockProps> = ({ block, values, errors, onChangeField, onBlurField }) => {
  if (isFieldDeclaration(block)) {
    return (
      <SizeableBox mb={1} flexGrow={1} $width={block.width}>
        <Field
          {...block}
          error={errors[block.name]}
          value={values[block.name]}
          onChange={onChangeField}
          onBlur={onBlurField}
        />
      </SizeableBox>
    );
  }

  const subBlocks = (
    <Flex
      flexDirection={block.direction === Direction.HORIZONTAL ? 'row' : 'column'}
      flexWrap="wrap"
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
      <SizeableBox $width={block.width} p={GAP}>
        <FieldSet direction={block.direction} label={block.label}>
          {subBlocks}
        </FieldSet>
      </SizeableBox>
    );
  }

  return <SizeableBox $width={block.width}>{subBlocks}</SizeableBox>;
};

export default FieldBlock;
