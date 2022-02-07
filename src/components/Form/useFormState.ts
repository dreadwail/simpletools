import isEmpty from 'lodash/isEmpty';
import { Reducer, useCallback, useMemo, useReducer } from 'react';

import type { Fields, FormValues, Values } from './types';

type FieldBooleans<TFormValues extends FormValues> = {
  [TFieldName in keyof TFormValues]?: boolean;
};

type FieldStrings<TFormValues extends FormValues> = {
  [TFieldName in keyof TFormValues]?: string;
};

type FormState<TFormValues extends FormValues> = {
  readonly errors: FieldBooleans<TFormValues>;
  readonly helperTexts: FieldStrings<TFormValues>;
  readonly values: Values<TFormValues>;
  readonly touched: FieldBooleans<TFormValues>;
};

const isFieldRequired = <TFormValues extends FormValues>(
  fieldName: keyof TFormValues,
  fields: Fields<TFormValues>,
  values: Values<TFormValues>
): boolean => {
  const field = fields[fieldName];
  if (!field) {
    return false;
  }
  if (typeof field.isRequired === 'boolean') {
    return field.isRequired;
  }
  if (field.isRequired) {
    return field.isRequired(values);
  }
  return false;
};

const isFieldDisabled = <TFormValues extends FormValues>(
  fieldName: keyof TFormValues,
  fields: Fields<TFormValues>,
  values: Values<TFormValues>
): boolean => {
  const field = fields[fieldName];
  if (!field) {
    return false;
  }
  if (typeof field.isDisabled === 'boolean') {
    return field.isDisabled;
  }
  if (field.isDisabled) {
    return field.isDisabled(values);
  }
  return false;
};

const process = <TFormValues extends FormValues>(
  fields: Fields<TFormValues>,
  formState: FormState<TFormValues>
): FormState<TFormValues> =>
  Object.keys(fields).reduce<FormState<TFormValues>>((state, fieldName) => {
    const field = fields[fieldName];
    if (!field) {
      return state;
    }

    const isRequired = isFieldRequired(field.name, fields, state.values);
    const toValidate = state.values[field.name];

    const isMissing =
      toValidate === null ||
      toValidate === undefined ||
      (typeof toValidate !== 'boolean' && isEmpty(toValidate));

    if (isMissing && isRequired) {
      return {
        ...state,
        errors: { ...state.errors, [field.name]: state.touched[field.name] },
        helperTexts: { ...state.helperTexts, [field.name]: 'Required' },
      };
    }

    const errorMessage = field.validate?.(toValidate, state.values);
    if (errorMessage) {
      return {
        ...state,
        errors: { ...state.errors, [field.name]: state.touched[field.name] },
        helperTexts: { ...state.helperTexts, [field.name]: errorMessage },
      };
    }

    return {
      ...state,
      errors: { ...state.errors, [field.name]: false },
      helperTexts: { ...state.helperTexts, [field.name]: field.helperText },
    };
  }, formState);

type OnChangeAction<TFormValues extends FormValues, TFieldName extends keyof TFormValues> = {
  readonly type: 'CHANGED';
  readonly payload: {
    readonly name: TFieldName;
    readonly value: TFormValues[TFieldName];
    readonly fields: Fields<TFormValues>;
  };
};

const onChangeAction = <TFormValues extends FormValues, TFieldName extends keyof TFormValues>(
  payload: OnChangeAction<TFormValues, TFieldName>['payload']
): OnChangeAction<TFormValues, TFieldName> => ({
  type: 'CHANGED',
  payload,
});

type OnBlurAction<TFormValues extends FormValues, TFieldName extends keyof TFormValues> = {
  readonly type: 'BLURRED';
  readonly payload: {
    readonly name: TFieldName;
    readonly fields: Fields<TFormValues>;
  };
};

const onBlurAction = <TFormValues extends FormValues, TFieldName extends keyof TFormValues>(
  payload: OnBlurAction<TFormValues, TFieldName>['payload']
): OnBlurAction<TFormValues, TFieldName> => ({
  type: 'BLURRED',
  payload,
});

type FormStateAction<TFormValues extends FormValues> =
  | OnChangeAction<TFormValues, keyof TFormValues>
  | OnBlurAction<TFormValues, keyof TFormValues>;

const formStateReducer = <TFormValues extends FormValues>(
  state: FormState<TFormValues>,
  action: FormStateAction<TFormValues>
): FormState<TFormValues> => {
  switch (action.type) {
    case 'CHANGED': {
      const { name, value, fields } = action.payload;

      return process(fields, {
        ...state,
        touched: {
          ...state.touched,
          [name]: true,
        },
        values: { ...state.values, [name]: value },
      });
    }
    case 'BLURRED': {
      const { name, fields } = action.payload;

      return process(fields, {
        ...state,
        touched: {
          ...state.touched,
          [name]: true,
        },
      });
    }
    default:
      return state;
  }
};

const buildInitialFormState = <TFormValues extends FormValues>(
  fields: Fields<TFormValues>
): FormState<TFormValues> => {
  const initialFormState = Object.keys(fields).reduce<FormState<TFormValues>>(
    (memo, fieldName) => {
      const field = fields[fieldName];
      if (!field) {
        return memo;
      }
      return {
        ...memo,
        values: {
          ...memo.values,
          [fieldName]: field.initialValue,
        },
      };
    },
    {
      errors: {},
      helperTexts: {},
      values: {},
      touched: {},
    }
  );
  return process(fields, initialFormState);
};

const useFormState = <TFormValues extends FormValues>(fields: Fields<TFormValues>) => {
  const initialFormState = useMemo(() => buildInitialFormState(fields), [fields]);

  const [formState, dispatch] = useReducer<
    Reducer<FormState<TFormValues>, FormStateAction<TFormValues>>
  >(formStateReducer, initialFormState);

  const errors = useMemo(
    () =>
      Object.keys(formState.errors).reduce(
        (memo, fieldName) => ({
          ...memo,
          [fieldName]: formState.errors[fieldName] ? formState.helperTexts[fieldName] : null,
        }),
        {}
      ),
    [formState.errors, formState.helperTexts]
  );

  return {
    errors,
    helperTexts: formState.helperTexts,
    values: formState.values,
    onChange: useCallback(
      <TFieldName extends keyof TFormValues>(name: TFieldName, value: TFormValues[TFieldName]) => {
        dispatch(onChangeAction({ name, value, fields }));
      },
      [fields]
    ),
    onBlur: useCallback(
      <TFieldName extends keyof TFormValues>(name: TFieldName) => {
        dispatch(onBlurAction({ name, fields }));
      },
      [fields]
    ),
    isFieldDisabled: useCallback(
      (fieldName: keyof TFormValues) => isFieldDisabled(fieldName, fields, formState.values),
      [fields, formState.values]
    ),
    isFieldRequired: useCallback(
      (fieldName: keyof TFormValues) => isFieldRequired(fieldName, fields, formState.values),
      [fields, formState.values]
    ),
    isValid: useMemo(
      () => Object.values(formState.errors).filter(errorState => errorState).length > 0,
      [formState.errors]
    ),
  };
};

export default useFormState;
