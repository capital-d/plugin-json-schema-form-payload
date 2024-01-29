import type { Field } from 'payload/types'

import { JsonSchemaFormField } from '../../../src'
import { isCondition } from '../access/isCondition'
import { isAdminField } from '../access/isAdminField'



type JsonForm = (
  overrides?: Partial<Field>,
) => Field

export const jsonForm: Field = {
  name: 'content',
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
    )
  ],
}


// export const jsonForm: JsonForm = (
//   overrides
// ) =>
//   deepMerge<any, Partial<any>>(
//     {
//       name: 'json-form',
//       label: false,
//       type: 'group',
//       fields: [
//         ...JsonSchemaFormField(
//           {
//             name: 'data',
//             required: true,
//             localized: true
//           },
//           {
//             hideSchemas: true,
//             required: true,
//             readOnly: false,
//             schemas: {
//               condition: isCondition,
//               access: {
//                 create: isAdminField,
//                 update: isAdminField,
//                 read: () => true,
//               }
//             }
//           },
//         ),
//         {
//           name: 'renderer',
//           type: 'select',
//           hasMany: false,
//           options: [
//             {
//               label: 'Work card 1',
//               value: 'work-card-1',
//             },
//             {
//               label: 'Work card 2',
//               value: 'work-card-2',
//             },
//             {
//               label: 'Work card 3',
//               value: 'work-card-3',
//             }
//           ],
//         },
//         {
//           name: 'media',
//           type: 'upload',
//           relationTo: 'media',
//           required: true,
//           admin: {
//           },
//         },
//       ],
//     },
//     overrides || {},
//   )