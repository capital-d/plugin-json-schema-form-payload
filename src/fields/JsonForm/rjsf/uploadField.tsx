import React, { useCallback, useEffect, useState } from 'react'
import { RJSFSchema, UiSchema, WidgetProps, RegistryWidgetsType, FieldProps, UIOptionsType } from '@rjsf/utils';
import { FieldHook, SanitizedCollectionConfig } from 'payload/types';
import { fieldTypes } from 'payload/components/forms';
import { usePayloadAPI } from 'payload/components/hooks';
import { useConfig } from 'payload/components/utilities'

import UploadWrapper from './uploadWrapper'
import payload from 'payload';

const initialParams = {
  depth: 0,
}

const ClearButton: React.FC = () => {
  return <button onClick={() => { console.log('s') }}>X</button>
}

const admin = {
  components: {
    Label: ClearButton
  }
}

type UiOptionsUpload = UIOptionsType & { relationTo?: string }

export const uploadField = function (props: FieldProps) {
  const { formData, name, uiSchema } = props
  const uiOptions = uiSchema?.['ui:options']
  //path is not used
  const { relationTo = 'media', path } = uiOptions as UiOptionsUpload ?? {}


  // const { relationTo } = props.options as {relationTo: string}

  const [uploadId, setUploadId] = useState(formData?.id)

  const additional:Record<string,any> = {}
  if (formData?.id) {
    additional.defaultValue = formData.id
  }

  const {
    collections,
    routes: { api },
    serverURL,
  } = useConfig()

  const [{ data, isLoading, isError }, { setParams }] = usePayloadAPI(
    `${serverURL}${api}/${relationTo}/${uploadId}`,
    { initialParams },
  )

  useEffect(() => {
    if (isLoading || isError) {
      return
    }
    const isSame = uploadId === formData?.id
    if (isSame) {
      return
    }
    props.onChange({ id: uploadId, url:'some url', data })
    
  }, [uploadId, isLoading])


  const onChange = async (id: any) => {
    setUploadId(id)
    // props.onChange({ id, url: data?.url })
  }

  return (
    <div>
      {isLoading && <span>LOADING...</span>}
      {relationTo && <UploadWrapper
        name={`jsonForm.data.${name}`}
        // defaultValue={formData?.id}
        relationTo={relationTo}
        fieldTypes={fieldTypes}
        // path={`jsonForm.data.${name}`}
        path={`some name`}
        onChange={onChange}
        {...additional}
      />}
    </div>

  );
};