import type { Access } from 'payload'

import { checkRole } from '@/access/utilities'

/**
 * Atomic access checker that verifies if the user owns the document being accessed.
 * Returns a Where query to filter documents by the customer field.
 *
 * Admins have full access, authenticated users get filtered by customer field,
 * and unauthenticated users are denied access.
 *
 * @returns true for admins, Where query for customers, false for guests
 */
export const isDocumentOwner: Access = ({ req, id }) => {
  // Admin has full access
  if (req.user && checkRole(['admin'], req.user)) {
    return true
  }

  // Authenticated user - return Where query to filter by customer
  if (req.user?.id) {
    // Prevent IDOR by ensuring the user can only access their own data
    return {
      and: [
        {
          customer: {
            equals: req.user.id,
          },
        },
        {
          id: {
            equals: id, // Ensure the ID matches the requested document
          },
        },
      ],
    }
  }

  // Guest - no access
  return false
}
