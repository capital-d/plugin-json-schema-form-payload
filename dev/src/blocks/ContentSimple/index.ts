import type { Block, Field } from 'payload/types'

import { jsonForm } from '../../fields/jsonForm'

const columnFields: Field[] = [
  jsonForm(),
  {
    name: 'enableLink',
    type: 'checkbox',
  },
]

export const ContentSimple: Block = {
  slug: 'content',
  fields: [
    {
      name: 'columns',
      type: 'array',
      fields: columnFields,
    },
  ],
}
