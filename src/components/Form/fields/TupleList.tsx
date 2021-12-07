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
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Flex from '../../Flex';
import type { TupleListFieldDeclaration, TupleListValue, TupleValue } from '../types';

import Text, { KeyPress } from './Text';

export type TupleListProps<TFieldName extends string> = Omit<
  TupleListFieldDeclaration<TFieldName>,
  'type' | 'name' | 'isRequired' | 'isDisabled'
> & {
  readonly name?: string;
  readonly isRequired?: boolean;
  readonly isDisabled?: boolean;
  readonly value?: TupleListValue;
  readonly hasError?: boolean;
  readonly onChange?: (value: TupleListValue) => void;
  readonly onBlur?: () => void;
};

const TupleList = <TFieldName extends string>({
  isRequired,
  isDisabled,
  label,
  fields,
  separator,
  helperText,
  initialValue,
  value,
  hasError,
  onChange,
  onBlur,
}: TupleListProps<TFieldName>) => {
  const initialTupleToAdd = useMemo(() => Array<string>(fields.length).fill(''), [fields]);

  const initialTouched = useMemo(() => Array<boolean>(fields.length).fill(false), [fields]);

  const [tupleToAdd, setTupleToAdd] = useState<TupleValue>(initialTupleToAdd);
  const [tupleList, setTupleList] = useState<TupleListValue>(value ?? initialValue ?? []);
  const [touched, setTouched] = useState<boolean[]>(initialTouched);

  useEffect(() => {
    onChange?.(tupleList);
  }, [tupleList, onChange]);

  const onChangeText = useCallback((index: number, newText: string) => {
    setTupleToAdd(oldTupleToAdd => {
      const newTupleToAdd = [...oldTupleToAdd];
      newTupleToAdd[index] = newText;
      return newTupleToAdd;
    });
  }, []);

  const onChangeTexts = useMemo(
    () => fields.map((_, index) => (newText: string) => onChangeText(index, newText)),
    [fields, onChangeText]
  );

  const onBlurText = useCallback((index: number) => {
    setTouched(oldTouched => {
      const newTouched = [...oldTouched];
      newTouched[index] = true;
      return newTouched;
    });
  }, []);

  const onBlurTexts = useMemo(
    () => fields.map((_, index) => () => onBlurText(index)),
    [fields, onBlurText]
  );

  useEffect(() => {
    const allTouched = touched.every(isTouched => isTouched);
    if (allTouched) {
      onBlur?.();
    }
  }, [fields, onBlur, touched]);

  const onClickAdd = useCallback(() => {
    setTupleList((oldTupleList: TupleListValue): TupleListValue => [...oldTupleList, tupleToAdd]);
    setTupleToAdd(initialTupleToAdd);
  }, [initialTupleToAdd, tupleToAdd]);

  const inputsRef = useRef<HTMLInputElement[]>(Array(fields.length).fill(null));

  const allFieldsHaveValue = useMemo(() => tupleToAdd.every(field => field), [tupleToAdd]);

  const onKeyPress = useCallback(
    (index: number, keyPress: KeyPress) => {
      if (keyPress.key === 'Enter') {
        const isLastField = index === fields.length - 1;
        if (isLastField) {
          const fieldHasValue = tupleToAdd[index];
          if (allFieldsHaveValue) {
            onClickAdd();
          } else if (fieldHasValue) {
            const firstEmptyField = tupleToAdd.findIndex(field => !field);
            inputsRef.current[firstEmptyField]?.focus();
          }
        } else {
          inputsRef.current[index + 1]?.focus();
        }
      }
    },
    [allFieldsHaveValue, fields.length, onClickAdd, tupleToAdd]
  );

  const onKeyPresses = useMemo(
    () => fields.map((_, index) => (keyPress: KeyPress) => onKeyPress(index, keyPress)),
    [fields, onKeyPress]
  );

  const onClickDelete = useCallback((index: number) => {
    setTupleList((oldTupleList: TupleListValue): TupleListValue => {
      const newTupleList = [...oldTupleList];
      newTupleList.splice(index, 1);
      return newTupleList;
    });
  }, []);

  const tuplesWithDeletes = useMemo(
    () =>
      tupleList.map((tuple, index) => ({
        tuple,
        onDelete: () => onClickDelete(index),
      })),
    [tupleList, onClickDelete]
  );

  const isFirstField = useCallback((index: number) => index === 0, []);
  const isLastField = useCallback((index: number) => index === fields.length - 1, [fields.length]);

  return (
    <Flex flexDirection="column" width="100%">
      <Flex flexDirection="row" alignItems="flex-start">
        {fields.map((field, index) => (
          <Fragment key={field}>
            <Text
              isRequired={isRequired && isLastField(index)}
              isDisabled={isDisabled}
              label={`${label} - ${field}`}
              helperText={isFirstField(index) ? helperText : ''}
              inputRef={(element: HTMLInputElement) => {
                inputsRef.current[index] = element;
              }}
              hasError={hasError}
              value={tupleToAdd[index]}
              onBlur={onBlurTexts[index]}
              onChange={onChangeTexts[index]}
              onKeyPress={onKeyPresses[index]}
            />
            {!isLastField(index) && (
              <Box my={1} mx={0.5}>
                {separator}
              </Box>
            )}
          </Fragment>
        ))}
        <Box my={1}>
          <IconButton
            aria-label="add"
            size="small"
            onClick={onClickAdd}
            disabled={!allFieldsHaveValue}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Flex>
      <TableContainer>
        <Table size="small" aria-label={label}>
          <TableHead>
            <TableRow>
              {fields.map((field, index) => (
                <Fragment key={field}>
                  <TableCell>{field}</TableCell>
                  {!isLastField(index) && <TableCell />}
                </Fragment>
              ))}
              <TableCell aria-label="delete" />
            </TableRow>
          </TableHead>
          <TableBody>
            {tuplesWithDeletes.map(({ tuple, onDelete }) => (
              <TableRow key={tuple.join('')}>
                {fields.map((field, index) => (
                  <Fragment key={field}>
                    <TableCell>{tuple[index]}</TableCell>
                    {!isLastField(index) && <TableCell>{separator}</TableCell>}
                  </Fragment>
                ))}
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
