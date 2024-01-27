import type { CollectionAfterReadHook, CollectionConfig, Condition, Field, FieldBase, FieldHook, JSONField } from 'payload/types'
// import type { Config } from 'payload/config'
import deepMerge from '../../utilities/deepMerge'
// import { NumberField as NumberFieldType, JSONField } from 'payload/types'
import { PartialRequired } from '../../utilities/partialRequired'
import JsonFromComponent from './JsonFromComponent'

type FieldTypes = JSONField

export interface JsonFromConfig {
  required: boolean,
  readOnly: boolean,
  hideSchemas?: boolean,
  callback?: (value: string) => number,
  schemas?: {
    condition?: Condition,
    access?: FieldBase['access']
  }
}

export type Config = JsonFromConfig & {}

type JsonFrom = (
  /**
   * Field overrides
   */
  overrides: PartialRequired<FieldTypes, 'name'>,
  config: Config,
) => Field[]

export const afterReadHook: CollectionAfterReadHook = ({ doc }) => {
  const newDoc = {
    ...doc,
    original_doc: {
      url: doc.url,
      filename: doc.filename,
    },
    url: doc.cloudinary.secure_url,
    filename: doc.cloudinary.public_id,
  };
  return {};
};

export const afterReadFeildHook: FieldHook = (data) => {
  return {};
};

export const JsonSchemaFormField:JsonFrom = (overrides, config) => {
  const jsonFormField = deepMerge<FieldTypes, Partial<FieldTypes>>(
    {
      name: 'form',
      type: 'json',
      access: { read: () => true },
      required: config.required,
      // hooks: {
      //   afterRead: [afterReadFeildHook],
      // },
      admin: {
        readOnly: config.readOnly,
        components: {
          Field: JsonFromComponent,
        },
      },
      custom: {
        config: config,
      },
    },
    overrides,
  )

  const helperFields = {
        label: 'Helper schemas',
        type: 'collapsible', // required
        
        access: config.schemas?.access ? { 
          ...config.schemas.access
        } : {},
        // access: {
        //   create: ({ req: { user } }: any) => { 
        //     console.log('user', user)
        //     //only admins can create
        //     if(!user) {
        //       return false
        //     }
        //     return true
        //   },
        //   read: ({ req: { user } }: any) => { 
        //     console.log('user', user)
        //     if (config.hideSchemas) {
        //       return false
        //     }
        //     return true
        //    },
        //   update: ({ req: { user } }: any) => { 
        //     //only admins can update
        //     console.log('user', user)
        //     if(!user) {
        //       return false
        //     }
        //     return true
        //    },
        // },
        admin: {
          condition: config?.schemas?.condition,
        },
        fields: [
          {
            type: 'row',
            fields: [
              {
                name: 'schema',
                type: 'json',
                required: true,
                admin: {
                  width: '50%',
                },
                access: config.schemas?.access ? { 
                  ...config.schemas.access
                } : {
                  read: () => true
                },
              },
              {
                name: 'uiSchema',
                type: 'json',
                required: false,
                admin: {
                  width: '50%',
                },
                access: config.schemas?.access ? { 
                  ...config.schemas.access
                } : {},
              },
            ]
          }
        ],
      } satisfies Field 
  

  // combine form, schema and uischema 
  const fields = [jsonFormField, helperFields]

  return fields
}