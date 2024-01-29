export const checkRoles = (allRoles:string[] = [], ueserRoles: string[] | unknown = []) => {
    if (!Array.isArray(ueserRoles)) {
        return false
    }

    return allRoles.some(role => {
        return ueserRoles.some(individualRole => {
            return individualRole === role
        })
    })
}