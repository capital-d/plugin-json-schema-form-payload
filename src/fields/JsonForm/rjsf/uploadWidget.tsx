import React, { useCallback } from 'react'
import Upload from 'payload/dist/admin/components/forms/field-types/Upload/'
import { RJSFSchema, UiSchema, WidgetProps, RegistryWidgetsType } from '@rjsf/utils';
import { FieldHook, SanitizedCollectionConfig } from 'payload/types';
import { fieldTypes } from 'payload/components/forms';
import { usePayloadAPI } from 'payload/components/hooks';
import { useConfig } from 'payload/components/utilities'

import UploadWrapper from './uploadWrapper'

const initialParams = {
  depth: 0,
}


const schema: RJSFSchema = {
  type: 'boolean',
  default: true,
};

const uiSchema: UiSchema = {
  'ui:widget': 'checkbox',
};

const afterUpload: FieldHook = ({ value, previousValue, req }) => {
  console.log(value)
  if (value !== previousValue) {
    // Log or perform an action when the membership status changes
    console.log(`User ID ${req.user.id} changed their membership status from ${previousValue} to ${value}.`)
    // Here, you can implement actions that could track conversions from one tier to another
  }
}

const beforeUpload: FieldHook = ({ value, operation }) => {
  console.log('operation', operation)
  if (operation === 'create') {
    // Perform additional validation or transformation for 'create' operation
  }
  return value
}

const beforeValidate: FieldHook = ({ value }) => {
  // Trim whitespace and convert to lowercase
  console.log(value)
  return value
}

const hooks = {
  beforeValidate: [beforeValidate],
  beforeChange: [beforeUpload],
  afterChange: [afterUpload],
}

const ClearButton: React.FC = () => {
  return <button onClick={() => { console.log('s') }}>X</button>
}

const admin = {
  components: {
    Label: ClearButton
  }
}

export const uploadWidget = function (props: WidgetProps) {
  console.log(props)
  const { value = null, name } = props
  const { relationTo } = props.options as { relationTo: string }

  // return (
  //     <Upload collection={collection} />
  // )

  const {
    collections,
    routes: { api },
    serverURL,
  } = useConfig()

  const [{ data }, { setParams }] = usePayloadAPI(
    `${serverURL}${api}/${relationTo}/${value}`,
    { initialParams },
  )
  console.log(`${serverURL}${api}/${relationTo}/${value?.id}`)
  console.log(data)

  const onChange = (event: any) => {
    console.log(event)
    props.onChange({ id: event, path: 'str' })
  }
  return (
    <div>
      <p id='custom' className={props.value ? 'checked' : 'unchecked'} onClick={() => props.onChange(!props.value)}>
        {String(props.value)}
      </p>
      {/* {relationTo && <Upload name={`jsonForm.data.${name}`} admin={admin} defaultValue={value} relationTo={relationTo} hooks={hooks} fieldTypes={fieldTypes} path={`jsonForm.data.${name}`} />} */}
      {relationTo && <UploadWrapper
        name={`jsonForm.data.${name}`}
        defaultValue={value?.id}
        relationTo={relationTo}
        //  hooks={hooks}
        fieldTypes={fieldTypes}
        path={`jsonForm.data.${name}`}
        onChange={onChange}
      />}
    </div>

  );
};