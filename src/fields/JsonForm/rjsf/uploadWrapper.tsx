import { UploadInput, useField, withCondition } from 'payload/components/forms'
import { FieldTypes } from 'payload/config'
import { useConfig } from 'payload/dist/admin/components/utilities/Config'
import { UploadField } from 'payload/types'
import React, { useCallback, useState } from 'react'

// import type { Props } from './types'

import { upload } from 'payload/dist/fields/validations'
// import { useConfig } from '../../../utilities/Config'
// import useField from '../../useField'
// import withCondition from '../../withCondition'
// import UploadInput from './Input'
// import './index.scss'

export type Props = Omit<UploadField, 'type'> & {
    fieldTypes: FieldTypes
    path?: string
    onChange: ((e: any) => void)
  }


  const UploadWrapper: React.FC<Props> = (props) => {
    const {
      collections,
      routes: { api },
      serverURL,
    } = useConfig()
  
    const {
      name,
      defaultValue = undefined,
      admin: {
        className,
        condition,
        description,
        readOnly,
        style,
        width,
        components: { Error, Label } = {Error: undefined, Label: undefined},
      } = {},
      fieldTypes,
      filterOptions = null,
      label,
      path = 'string',
      relationTo,
      required,
      validate = upload,
      onChange,
    } = props

  
    const collection = collections.find((coll) => coll.slug === relationTo)
  
    const memoizedValidate = useCallback(
      (value:unknown, options:Record<string, unknown>) => {
        return validate(value, { ...options, required })
      },
      [validate, required],
    )
  
    const field = useField({
      condition,
      path,
      validate: memoizedValidate,
    })
  
    // const { errorMessage, setValue, showError, value } = field
    const { errorMessage, showError } = field

    const [value, setValue] = useState(defaultValue)

    const onChangeLitener = useCallback(
      (incomingValue:Record<string, unknown> | unknown) => {
        //@ts-expect-error
        const incomingID = incomingValue?.id || incomingValue
        setValue(incomingID)
        onChange(incomingID)
      },
      [setValue],
    )
  
    if (collection?.upload) {
      return (
        <UploadInput
          api={api}
          className={className}
          collection={collection}
          description={description}
          errorMessage={errorMessage}
          fieldTypes={fieldTypes}
          filterOptions={filterOptions}
          label={label}
          name={name}
          onChange={onChangeLitener}
          path={path}
          readOnly={readOnly}
          relationTo={relationTo}
          required={required}
          serverURL={serverURL}
          showError={showError}
          style={style}
          value={value as string}
          width={width}
          Error={Error}
          Label={Label}
        />
      )
    }
  
    return null
  }
  export default withCondition(UploadWrapper)