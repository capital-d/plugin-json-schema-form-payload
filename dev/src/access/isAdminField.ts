import type { FieldHook } from 'payload/types'

import { checkUserRoles } from '../utilities/checkUserRoles'


export const isAdminField: FieldHook = ({ req: { user } }) =>{
    return checkUserRoles(['admin'], user)
}