import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MaterialList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Flex from '../../Flex';
import type { ListFieldDeclaration, ListValue } from '../types';

import Text, { KeyPress } from './Text';

export type ListProps<TFieldName extends string> = Omit<
  ListFieldDeclaration<TFieldName>,
  'type' | 'name'
> & {
  readonly name?: string;
  readonly isRequired: boolean;
  readonly value?: ListValue;
  readonly hasError: boolean;
  readonly onChange: (value: ListValue) => void;
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
  const [list, setList] = useState<ListValue>(value ?? initialValue ?? []);

  useEffect(() => {
    onChange(list);
  }, [list, onChange]);

  const onChangeText = useCallback((newText: string) => {
    setTextToAdd(newText);
  }, []);

  const onClickAdd = useCallback(() => {
    setList((oldList: ListValue): ListValue => [...oldList, textToAdd]);
    setTextToAdd('');
  }, [textToAdd]);

  const onKeyPress = useCallback(
    (keyPress: KeyPress) => {
      if (keyPress.key === 'Enter') {
        onClickAdd();
      }
    },
    [onClickAdd]
  );

  const onClickDelete = useCallback((index: number) => {
    setList((oldList: ListValue): ListValue => {
      const newList = [...oldList];
      newList.splice(index, 1);
      return newList;
    });
  }, []);

  const listWithDeletes = useMemo(
    () =>
      list.map((entry, index) => ({
        entry,
        onDelete: () => onClickDelete(index),
      })),
    [list, onClickDelete]
  );

  return (
    <Flex flexDirection="column" width="100%">
      <Flex flexDirection="row" alignItems="flex-start">
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
          onKeyPress={onKeyPress}
        />
        <Box my={1}>
          <IconButton aria-label="add" size="small" onClick={onClickAdd} disabled={!textToAdd}>
            <AddIcon />
          </IconButton>
        </Box>
      </Flex>
      <MaterialList dense>
        {listWithDeletes.map(({ entry, onDelete }) => (
          <ListItem key={entry} divider>
            <ListItemText>{entry}</ListItemText>
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={onDelete}>
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
