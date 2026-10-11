import type { PayloadRequest } from 'payload'

export const withPayloadTransaction = async <T>(
  req: PayloadRequest,
  operation: () => Promise<T>,
): Promise<T> => {
  if (req.transactionID) return operation()

  const transactionID = await req.payload.db.beginTransaction({
    accessMode: 'read write',
    isolationLevel: 'serializable',
  })
  if (!transactionID) return operation()

  const originalTransactionID = req.transactionID
  req.transactionID = transactionID

  try {
    const result = await operation()
    await req.payload.db.commitTransaction(transactionID)
    return result
  } catch (error) {
    await req.payload.db.rollbackTransaction(transactionID)
    throw error
  } finally {
    req.transactionID = originalTransactionID
  }
}
