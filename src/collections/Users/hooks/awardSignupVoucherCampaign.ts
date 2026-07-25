import { awardSignupVoucherForUser } from '@/lib/signupVoucherCampaign'

export const awardSignupVoucherCampaignAfterChange = async ({ doc, operation, req }: any) => {
  if (operation !== 'create' || !doc?.id) return

  try {
    await awardSignupVoucherForUser({
      req,
      user: doc,
    })
  } catch (error) {
    req.payload.logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        userID: doc.id,
      },
      '[SignupVoucherCampaign] Failed to award signup voucher',
    )
  }
}
