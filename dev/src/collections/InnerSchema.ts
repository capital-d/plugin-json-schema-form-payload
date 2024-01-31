import { CollectionConfig } from 'payload/types'
import { JsonSchemaFormField } from '../../../src'
import { admins } from '../access/admins'
import { isAdminField } from '../access/isAdminField'
import { checkUserRoles } from '../utilities/checkUserRoles'
import { User } from 'payload/dist/auth'
import { isCondition } from '../access/isCondition'
import { ContentSimple } from '../blocks/ContentSimple'
import { slugField } from '../fields/slug'

const InnerSchema: CollectionConfig = {
    slug: 'innerSchema',
    access: { read: () => true },
    admin: {
        useAsTitle: 'title',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
        },
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Content',
                    fields: [
                        {
                            name: 'layout',
                            type: 'blocks',
                            required: true,
                            blocks: [ContentSimple],
                        },
                    ],
                },
            ],
        },
        slugField(),
    ],
}

export default InnerSchema