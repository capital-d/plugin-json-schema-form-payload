// import { User } from "payload/dist/auth"
import { checkUserRoles } from "../utilities/checkUserRoles"
import { Condition } from "payload/types"

export const isCondition: Condition = (data, siblingData, { user }) => {
    return checkUserRoles(['admin'], { ...user, createdAt: null, updatedAt: null, password: null })
}