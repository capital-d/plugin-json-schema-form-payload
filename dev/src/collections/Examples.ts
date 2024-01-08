import { CollectionConfig } from 'payload/types'
import { JsonSchemaFormField } from '../../../src'

const JsonFromExamples: CollectionConfig = {
  slug: 'jsonformExamples',
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    ...JsonSchemaFormField(
      {
        name: 'data',
        required: true,
        access: {
          read: () => true 
        },
      },
      {
        hideSchemas: true,
        required: true,
        readOnly: false
      },
    )
  ],
}

export default JsonFromExamples