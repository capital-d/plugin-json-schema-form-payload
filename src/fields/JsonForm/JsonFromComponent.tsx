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

const getKey = (key: string) => /schema/.test(key) ? 'schemaField' : /ui_schema/.test(key) ? 'uiSchemaField' : key

const filterRequiredFields = (fields: Fields) => {
  const values = Object.entries(fields)

  const filtered = values.filter(
    ([key, _]) => {
      const isSchema = /schema|ui_schema/.test(key)
      return isSchema
    }
  )
  .reduce((acc, [key, value]) => ({...acc, [getKey(key)]: value}), {schemaField: null, uiSchemaField: null} as {[k:string]: FormField|null})

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
  // type,
  ...others
}) => {
  const { config } = custom
  // const { value, setValue, showError, errorMessage } = useField<{data:any, schema:RJSFSchema, uiSchema:UiSchema}>({ path })
  const { value, setValue, showError, errorMessage } = useField<any>({ path })

  const {fields: {schemaField, uiSchemaField}, dispatch} = useFormFields(([fields, dispatch]) => ({fields: filterRequiredFields(fields), dispatch}))
  // const { value: schema, setValue: setSchema } = useField<RJSFSchema>({ path: 'schema' })
  // const { value: uiSchemaRaw, setValue: setUiSchema } = useField<Props>({ path: 'uiSchema' })

  const {value: schema} = schemaField ?? {value: null}
  const {value: uiSchemaRaw} = uiSchemaField ?? {value: null}

  const editorOptions = admin?.editorOptions
  const { callback, ...componentProps } = config
  const [subject] = useState(new Subject<{data: any, schema: RJSFSchema, uiSchema: UiSchema}>())


  const uiSchema = useMemo(
    () => {
      const newSchema = uiSchemaRaw ? { ...uiSchemaRaw, ...UISCHEMA } : UISCHEMA;
      return newSchema
    },
    [uiSchemaRaw]
  );


  useEffect(() => {
    const subscription = subject.pipe(debounceTime(1000)).subscribe(handleChangeSubscription)
    // if (value) {
    //   const {data, schema, uiSchema} = value
    //   handleChangeSubscription({data, schema, uiSchema})
    // }

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // useEffect(() => {
  //   console.log('set schema', schema)
  //   setSchema(schema)
  // }, [schema])

  // useEffect(() => {
  //   console.log('set schema', schema)
  //   setUiSchema(uiSchema)
  // }, [uiSchema])

  const handleChangeSubscription = ({data, schema, uiSchema}:{data: any, schema: RJSFSchema, uiSchema: UiSchema}) => {
    console.log('set value', data)
    // setValue({data, schema, uiSchema})
    setValue(data)
    dispatch({type: 'UPDATE', path: 'data', value: data})
    dispatch({type: 'UPDATE', path: 'schema', value: schema})
    dispatch({type: 'UPDATE', path: 'uiSchema', value: uiSchema})
    // setSchema(schema)
    // setUiSchema(uiSchema)
  }

  const handleChange = (value?: any) => {
    const { formData, schema, uiSchema } = value
    console.log(formData)
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
          uiSchema={uiSchema}
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
