import { CollectionConfig } from 'payload/types'
import { JsonSchemaFormField } from '../../../src'
import { admins } from '../access/admins'
import { isAdminField } from '../access/isAdminField'
import { checkUserRoles } from '../utilities/checkUserRoles'
import { User } from 'payload/dist/auth'
import { isCondition } from '../access/isCondition'

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
        readOnly: false,
        schemas: {
          condition: isCondition,
          access: {
            create: isAdminField,
            update: isAdminField,
            read: () => true,
          }
        }
      },
    )
  ],
}

export default JsonFromExamples