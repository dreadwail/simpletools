import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
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

import FieldSet from '../FieldSet';
import type { TupleListFieldDeclaration, TupleListValue, TupleValue } from '../types';

import Input, { KeyPress } from './Input';

export type TupleListProps<TFieldName extends string> = Omit<
  TupleListFieldDeclaration<TFieldName>,
  'controlType' | 'name' | 'isRequired' | 'isDisabled'
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
  const normalizedFields = useMemo(() => fields ?? [label], [label, fields]);
  const initialTupleToAdd = useMemo(
    () => Array<string>(normalizedFields.length).fill(''),
    [normalizedFields]
  );
  const initialTouched = useMemo(
    () => Array<boolean>(normalizedFields.length).fill(false),
    [normalizedFields]
  );

  const [tupleToAdd, setTupleToAdd] = useState<TupleValue>(initialTupleToAdd);
  const [tupleList, setTupleList] = useState<TupleListValue>(value ?? initialValue ?? []);
  const [touched, setTouched] = useState<boolean[]>(initialTouched);

  useEffect(() => {
    onChange?.(tupleList);
  }, [tupleList, onChange]);

  const onChangeTuple = useCallback((index: number, newValue: string) => {
    setTupleToAdd(oldTupleToAdd => {
      const newTupleToAdd = [...oldTupleToAdd];
      newTupleToAdd[index] = newValue;
      return newTupleToAdd;
    });
  }, []);

  const onChangeTuples = useMemo(
    () => normalizedFields.map((_, index) => (newValue: string) => onChangeTuple(index, newValue)),
    [normalizedFields, onChangeTuple]
  );

  const onBlurTuple = useCallback((index: number) => {
    setTouched(oldTouched => {
      const newTouched = [...oldTouched];
      newTouched[index] = true;
      return newTouched;
    });
  }, []);

  const onBlurTuples = useMemo(
    () => normalizedFields.map((_, index) => () => onBlurTuple(index)),
    [normalizedFields, onBlurTuple]
  );

  useEffect(() => {
    const allTouched = touched.every(isTouched => isTouched);
    if (allTouched) {
      onBlur?.();
    }
  }, [normalizedFields, onBlur, touched]);

  const onClickAdd = useCallback(() => {
    setTupleList((oldTupleList: TupleListValue): TupleListValue => [...oldTupleList, tupleToAdd]);
    setTupleToAdd(initialTupleToAdd);
  }, [initialTupleToAdd, tupleToAdd]);

  const inputsRef = useRef<HTMLInputElement[]>(Array(normalizedFields.length).fill(null));

  const allFieldsHaveValue = useMemo(() => tupleToAdd.every(field => field), [tupleToAdd]);

  const onKeyPress = useCallback(
    (index: number, keyPress: KeyPress) => {
      if (keyPress.key === 'Enter') {
        const isLastField = index === normalizedFields.length - 1;
        if (isLastField) {
          const fieldHasValue = tupleToAdd[index];
          if (allFieldsHaveValue) {
            onClickAdd();
            inputsRef.current[0]?.focus();
          } else if (fieldHasValue) {
            const firstEmptyField = tupleToAdd.findIndex(field => !field);
            inputsRef.current[firstEmptyField]?.focus();
          }
        } else {
          inputsRef.current[index + 1]?.focus();
        }
      }
    },
    [allFieldsHaveValue, normalizedFields.length, onClickAdd, tupleToAdd]
  );

  const onKeyPresses = useMemo(
    () => normalizedFields.map((_, index) => (keyPress: KeyPress) => onKeyPress(index, keyPress)),
    [normalizedFields, onKeyPress]
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

  const isLastField = useCallback(
    (index: number) => index === normalizedFields.length - 1,
    [normalizedFields.length]
  );

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <FieldSet label={label} helperText={helperText}>
        <Grid container alignItems="center">
          <Grid container item xs>
            {normalizedFields.map((field, index) => (
              <Fragment key={field}>
                <Grid item xs={12} sm>
                  <Box pr={0.5} pb={0.5}>
                    <Input
                      isRequired={isRequired && isLastField(index)}
                      isDisabled={isDisabled}
                      label={field}
                      inputRef={(element: HTMLInputElement) => {
                        inputsRef.current[index] = element;
                      }}
                      hasError={hasError}
                      value={tupleToAdd[index]}
                      onBlur={onBlurTuples[index]}
                      onChange={onChangeTuples[index]}
                      onKeyPress={onKeyPresses[index]}
                    />
                  </Box>
                </Grid>
                {!isLastField(index) && separator && (
                  <Grid item>
                    <Box my={1} mx={0.5}>
                      {separator}
                    </Box>
                  </Grid>
                )}
              </Fragment>
            ))}
          </Grid>
          <Grid item>
            <IconButton
              aria-label="add"
              size="small"
              onClick={onClickAdd}
              disabled={!allFieldsHaveValue}
            >
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>
      </FieldSet>
      {tuplesWithDeletes.length > 0 && (
        <Box mb={2}>
          <TableContainer>
            <Table size="small" padding="none" aria-label={label}>
              <TableHead>
                <TableRow>
                  {normalizedFields.map((field, index) => (
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
                    {normalizedFields.map((field, index) => (
                      <Fragment key={field}>
                        <TableCell>{tuple[index]}</TableCell>
                        {!isLastField(index) && <TableCell>{separator}</TableCell>}
                      </Fragment>
                    ))}
                    <TableCell align="right">
                      <IconButton aria-label="delete" onClick={onDelete}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default TupleList;
