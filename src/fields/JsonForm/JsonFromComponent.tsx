import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Label, useField, useFormFields } from 'payload/components/forms'
import Error from 'payload/dist/admin/components/forms/Error'
import { type TextField, type NumberField, type JSONField, type Fields, FormField } from 'payload/types'

import { JsonFromConfig } from '.'
import FieldDescription from 'payload/dist/admin/components/forms/FieldDescription'
import { debounceTime, Subject } from 'rxjs'
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/mui';

type SCHEMAS = RJSFSchema | UiSchema

const UISCHEMA: UiSchema = {
  'ui:submitButtonOptions': {
    norender: true,
    submitText: 'Submit',
  },
};

const SCHEMA: RJSFSchema = {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "href": {
        "type": "string",
        "title": "Ссылка"
      },
      "title": {
        "type": "string",
        "title": "Заголовок"
      },
      "external": {
        "enum": [
          false,
          true
        ],
        "type": "boolean",
        "title": "Внешняя ссылка",
        "default": false
      }
    }
  },
  "title": "Список пунктов меню"
}

type Props = JSONField & {
  path: string
  readOnly?: boolean
  placeholder?: string
  className?: string
  custom: {
    config: JsonFromConfig
  }
}

type SchemaKeys = 'schemaKV' | 'uiSchemaKV'

const getKey = (key: string) => /schema/.test(key) ? 'schemaKV' : /uiSchema/.test(key) ? 'uiSchemaKV' : 'never'

const filterRequiredFields = (fields: Fields) => {
  const values = Object.entries(fields)
  const filtered = values.filter(
    ([key, _]) => {
      const isSchema = /schema|uiSchema/.test(key)
      return isSchema
    }
  )
  .reduce((acc, [key, field]) => ({...acc, [getKey(key)]: [key, field.value] }), {schemaKV: null, uiSchemaKV: null} as {[k in SchemaKeys]: [string, SCHEMAS]|null})
    return filtered;
}

const JsonFromComponent: React.FC<Props> = ({
  readOnly,
  className,
  required,
  path,
  label,
  admin,
  custom,
  ...others
}) => {
  const { config } = custom
  const { value, setValue, showError, errorMessage } = useField<any>({ path })

  const {fields: {schemaKV, uiSchemaKV}, dispatch} = useFormFields(([fields, dispatch]) => ({fields: filterRequiredFields(fields), dispatch}))

  const editorOptions = admin?.editorOptions
  const { callback, ...componentProps } = config
  const [subject] = useState(new Subject<{data: any, schema: RJSFSchema, uiSchema: UiSchema}>())

  const [schemaKey, schema] = schemaKV ?? ['schema', null]
  const [uiSchemaKey, uiSchema] = uiSchemaKV ?? ['uiSchema', null]

  const uiSchemaCombined = useMemo(
    () => {
      const newSchema = uiSchema ? { ...uiSchema, ...UISCHEMA } : UISCHEMA;
      return newSchema
    },
    [uiSchema]
  );

  useEffect(() => {
    const subscription = subject.pipe(debounceTime(1000)).subscribe(handleChangeSubscription)

    return () => {
      subscription.unsubscribe()
    }
  }, [])


  const handleChangeSubscription = ({data, schema, uiSchema}:{data: any, schema: RJSFSchema, uiSchema: UiSchema}) => {
    
    setValue(data)
    dispatch({type: 'UPDATE', path, value: data})
    dispatch({type: 'UPDATE', path: schemaKey, value: schema})
    dispatch({type: 'UPDATE', path: uiSchemaKey, value: uiSchema})

  }

  const handleChange = (value?: any) => {
    const { formData, schema, uiSchema } = value
    subject.next({data: formData, schema, uiSchema})
  }

  const classes = [
    'field-type',
    'json',
    className,
    showError && 'error',
    readOnly && 'read-only',
    'container',
  ]
    .filter(Boolean)
    .join(' ')

  const isRequired = required
  const isReadonly = readOnly || admin?.readOnly

  return (
    <div className={`bfNumericFieldWrapper field-type`}>
      <Label htmlFor={`field-${path.replace(/\./gi, '__')}`} label={label} required={isRequired} />
      <div className={classes}>
        <Error showError={showError} message={errorMessage ?? ''} />
        {schema && <Form
          tagName="div"
          id={`field-${path.replace(/\./gi, '__')}`}
          name={path}
          schema={schema}
          uiSchema={uiSchemaCombined}
          validator={validator}
          formData={value}
          onChange={(data: any) => handleChange(data)}
          onSubmit={(data: any) => console.log('submitted')}
          onError={(error: any) => console.log('errors')}
          readonly={readOnly}
          liveOmit={true}
          omitExtraData={true}
          {...componentProps}
        />}
      </div>
      <FieldDescription
        className={`field-description-${path.replace(/\./g, '__')}`}
        description={admin?.description}
        value={value}
      />
    </div>
  )
}

export default JsonFromComponent
