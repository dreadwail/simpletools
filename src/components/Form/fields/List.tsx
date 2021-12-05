import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MaterialList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import { useCallback, useEffect, useState } from 'react';

import Flex from '../../Flex';
import type { ListFieldDeclaration } from '../types';

import Text from './Text';

export type ListProps<TFieldName extends string> = ListFieldDeclaration<TFieldName> & {
  readonly isRequired: boolean;
  readonly value?: string[];
  readonly hasError: boolean;
  readonly onChange: (...values: string[]) => void;
  readonly onBlur: () => void;
};

const List = <TFieldName extends string>({
  name,
  isRequired,
  label,
  helperText,
  prefix,
  suffix,
  initialValue,
  value,
  hasError,
  onChange,
  onBlur,
}: ListProps<TFieldName>) => {
  const [textToAdd, setTextToAdd] = useState<string>('');
  const [list, setList] = useState<string[]>(value ?? initialValue ?? []);

  const onChangeText = useCallback((newValue: string) => {
    setTextToAdd(newValue);
  }, []);

  const onClickAdd = useCallback(() => {
    setList((oldList: string[]): string[] => [...oldList, textToAdd]);
    setTextToAdd('');
  }, [textToAdd]);

  useEffect(() => {
    onChange(...list);
  }, [list, onChange]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('textToAdd:', textToAdd);
  }, [textToAdd]);

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="row" alignItems="flex-start">
        <Box m={1}>
          <Text
            name={name}
            isRequired={isRequired}
            label={label}
            helperText={helperText}
            prefix={prefix}
            suffix={suffix}
            hasError={hasError}
            value={textToAdd}
            onBlur={onBlur}
            onChange={onChangeText}
          />
        </Box>
        <IconButton aria-label="add" onClick={onClickAdd}>
          <AddIcon />
        </IconButton>
      </Flex>
      <MaterialList dense>
        {list.map(item => (
          <ListItem key={item} divider>
            <ListItemText>{item}</ListItemText>
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </MaterialList>
    </Flex>
  );
};

export default List;
