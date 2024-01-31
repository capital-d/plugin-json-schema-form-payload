import { CollectionConfig } from 'payload/types'
import { JsonSchemaFormField } from '../../../src'
import { admins } from '../access/admins'
import { isAdminField } from '../access/isAdminField'
import { checkUserRoles } from '../utilities/checkUserRoles'
import { User } from 'payload/dist/auth'
import { isCondition } from '../access/isCondition'
import { jsonForm } from '../fields/jsonForm'

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
    jsonForm(),
  ],
}

export default JsonFromExamples