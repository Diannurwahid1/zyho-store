import type { Access } from 'payload'
import { checkRole } from './utilities'

export const adminOrManager: Access = ({ req: { user } }) => checkRole(['admin', 'manager'], user)

export const adminOrFinance: Access = ({ req: { user } }) => checkRole(['admin', 'finance'], user)

export const adminOrSupport: Access = ({ req: { user } }) =>
  checkRole(['admin', 'manager', 'support'], user)

export const staffOnly: Access = ({ req: { user } }) =>
  checkRole(['admin', 'manager', 'finance', 'support'], user)

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const ownerOrStaff = (relationshipField = 'customer'): Access => {
  return ({ req: { user } }) => {
    if (!user) return false
    if (checkRole(['admin', 'manager', 'finance', 'support'], user)) return true

    return {
      [relationshipField]: {
        equals: user.id,
      },
    }
  }
}
