import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Flex from '../../Flex';
import type { TupleListFieldDeclaration, TupleListValue, TupleValue } from '../types';

import Text, { KeyPress } from './Text';

export type TupleListProps<TFieldName extends string> = Omit<
  TupleListFieldDeclaration<TFieldName>,
  'type' | 'name'
> & {
  readonly isRequired: boolean;
  readonly value?: TupleListValue;
  readonly hasError: boolean;
  readonly onChange: (value: TupleListValue) => void;
  readonly onBlur: () => void;
};

const TupleList = <TFieldName extends string>({
  isRequired,
  label,
  fieldLabel1,
  fieldLabel2,
  separator,
  helperText,
  initialValue,
  value,
  hasError,
  onChange,
  onBlur,
}: TupleListProps<TFieldName>) => {
  const [textToAdd, setTextToAdd] = useState<Record<number, string>>({ 0: '', 1: '' });
  const [tupleList, setTupleList] = useState<TupleListValue>(value ?? initialValue ?? []);
  const [touched, setTouched] = useState<Record<number, boolean>>({ 0: false, 1: false });

  useEffect(() => {
    onChange(tupleList);
  }, [tupleList, onChange]);

  const onChangeText = useCallback((index: number, newText: string) => {
    setTextToAdd(oldTextToAdd => ({ ...oldTextToAdd, [index]: newText }));
  }, []);

  const onChangeText0 = useCallback((newText: string) => onChangeText(0, newText), [onChangeText]);
  const onChangeText1 = useCallback((newText: string) => onChangeText(1, newText), [onChangeText]);

  const onBlurText = useCallback((index: number) => {
    setTouched(oldTouched => ({ ...oldTouched, [index]: true }));
  }, []);

  const onBlurText0 = useCallback(() => onBlurText(0), [onBlurText]);
  const onBlurText1 = useCallback(() => onBlurText(0), [onBlurText]);

  useEffect(() => {
    if (touched[0] && touched[1]) {
      onBlur();
    }
  }, [touched, onBlur]);

  const onClickAdd = useCallback(() => {
    const newTuple: TupleValue = [textToAdd[0], textToAdd[1]];
    setTupleList((oldTupleList: TupleListValue): TupleListValue => [...oldTupleList, newTuple]);
    setTextToAdd({ 0: '', 1: '' });
  }, [textToAdd]);

  const input0Ref = useRef<HTMLInputElement>(null);
  const input1Ref = useRef<HTMLInputElement>(null);

  const onKeyPress0 = useCallback(
    (keyPress: KeyPress) => {
      if (keyPress.key === 'Enter' && textToAdd[0]) {
        input1Ref.current?.focus();
      }
    },
    [textToAdd]
  );

  const onKeyPress1 = useCallback(
    (keyPress: KeyPress) => {
      if (keyPress.key === 'Enter' && textToAdd[0] && textToAdd[1]) {
        onClickAdd();
        input0Ref.current?.focus();
      }
    },
    [onClickAdd, textToAdd]
  );

  const onClickDelete = useCallback((index: number) => {
    setTupleList((oldTupleList: TupleListValue): TupleListValue => {
      const newTupleList = [...oldTupleList];
      newTupleList.splice(index, 1);
      return newTupleList;
    });
  }, []);

  const listWithDeletes = useMemo(
    () =>
      tupleList.map((tuple, index) => ({
        tuple,
        onDelete: () => onClickDelete(index),
      })),
    [tupleList, onClickDelete]
  );

  return (
    <Flex flexDirection="column" width="100%">
      <Flex flexDirection="row" alignItems="flex-start">
        <Text
          isRequired={isRequired}
          label={`${label} ${fieldLabel1}`}
          helperText={helperText}
          inputRef={input0Ref}
          hasError={hasError}
          value={textToAdd[0]}
          onBlur={onBlurText0}
          onChange={onChangeText0}
          onKeyPress={onKeyPress0}
        />
        <Box my={1} mx={0.5}>
          {separator}
        </Box>
        <Text
          isRequired={false}
          label={`${label} ${fieldLabel2}`}
          helperText={' '}
          inputRef={input1Ref}
          hasError={hasError}
          value={textToAdd[1]}
          onBlur={onBlurText1}
          onChange={onChangeText1}
          onKeyPress={onKeyPress1}
        />
        <Box my={1}>
          <IconButton
            aria-label="add"
            size="small"
            onClick={onClickAdd}
            disabled={!textToAdd[0] && !textToAdd[1]}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Flex>
      <TableContainer>
        <Table size="small" aria-label={label}>
          <TableHead>
            <TableRow>
              <TableCell>{fieldLabel1}</TableCell>
              <TableCell />
              <TableCell>{fieldLabel2}</TableCell>
              <TableCell aria-label="delete" />
            </TableRow>
          </TableHead>
          <TableBody>
            {listWithDeletes.map(({ tuple, onDelete }, index) => (
              <TableRow key={`tuple-${index}`}>
                <TableCell>{tuple[0]}</TableCell>
                <TableCell>{separator}</TableCell>
                <TableCell>{tuple[1]}</TableCell>
                <TableCell>
                  <IconButton edge="end" aria-label="delete" onClick={onDelete}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default TupleList;
