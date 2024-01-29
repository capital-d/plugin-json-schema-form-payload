import type { Access } from 'payload/config'

import { checkUserRoles } from '../utilities/checkUserRoles'

export const adminsOrPublished: Access = ({ req: { user } }) => {
  if (user && checkUserRoles(['admin'], user)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
