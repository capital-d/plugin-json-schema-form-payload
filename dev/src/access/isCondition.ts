import { checkRoles } from "../utilities/checkRoles"
import { Condition } from "payload/types"

export const isCondition: Condition = (data, siblingData, { user }) => {
    return checkRoles(['admin'], user?.roles)
}