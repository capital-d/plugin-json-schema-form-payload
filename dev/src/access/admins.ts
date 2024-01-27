import type { AccessArgs } from 'payload/config'

import type { User } from '../payload-types'
import { checkUserRoles } from '../utilities/checkUserRoles'

type isAdmin = (args: AccessArgs<unknown, User>) => boolean

export const admins: isAdmin = ({ req: { user } }) => {
  return checkUserRoles(['admin'], user)
}
