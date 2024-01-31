import type { Field } from 'payload/types'

import { JsonSchemaFormField } from '../../../src'
import { isCondition } from '../access/isCondition'
import { isAdminField } from '../access/isAdminField'

import deepMerge from '../utilities/deepMerge'


type JsonForm = (
  overrides?: Partial<Field>,
  fields?: Field[]
) => Field

export const jsonForm: JsonForm = (
  overrides,
  fields
) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'jsonForm',
      label: false,
      type: 'group',
      fields: [
        ...JsonSchemaFormField(
          {
            name: 'data',
            required: true,
            localized: true
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
        ),
        ...(fields || [])
      ],
    },
    overrides || {},
  )