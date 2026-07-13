import { recalculateUserMembership } from '@/lib/member'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const extractUserID = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value && typeof value.id === 'number') {
    return value.id
  }

  return null
}

export const syncMembershipAfterOrderChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  const userIDs = new Set<number>()

  const currentUserID = extractUserID(doc.customer)
  const previousUserID = extractUserID(previousDoc?.customer)

  if (currentUserID) userIDs.add(currentUserID)
  if (previousUserID) userIDs.add(previousUserID)

  for (const userID of userIDs) {
    await recalculateUserMembership(req, userID)
  }

  return doc
}

export const syncMembershipAfterOrderDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const userID = extractUserID(doc.customer)

  if (userID) {
    await recalculateUserMembership(req, userID)
  }

  return doc
}
