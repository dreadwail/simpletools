import Box from '@material-ui/core/Box';
import type { FC } from 'react';

import Flex from '../Flex';

import Field from './Field';
import type { Error, FieldBlockDeclaration, OnBlurHandler, OnChangeHandler, Value } from './types';
import { Direction } from './types';

type FieldName = string;

type FieldBlockProps = Omit<FieldBlockDeclaration, 'label'> & {
  readonly values: Record<FieldName, Value>;
  readonly errors: Record<FieldName, Error>;
  readonly onChangeField: OnChangeHandler;
  readonly onBlurField: OnBlurHandler;
};

const FieldBlock: FC<FieldBlockProps> = ({
  fields,
  values,
  errors,
  onChangeField,
  onBlurField,
  direction,
}) => (
  <Flex flexDirection={direction === Direction.HORIZONTAL ? 'row' : 'column'} gap={5}>
    {fields.map(field => (
      <Box key={field.name} mb={1} flexGrow={1}>
        <Field
          {...field}
          error={errors[field.name]}
          value={values[field.name]}
          onChange={onChangeField}
          onBlur={onBlurField}
          fullWidth
        />
      </Box>
    ))}
  </Flex>
);

export default FieldBlock;
