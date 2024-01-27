import type { User } from '../payload-types'

export const checkUserRoles = (allRoles: User['roles'] = [], user: User = undefined): boolean => {
  if (user) {
    if (
      allRoles.some(role => {
        const chek = user?.roles?.some(individualRole => {
          return individualRole === role
        })
        return chek
      })
    )
      return true
  }

  return false
}
