import { AccountForm } from '@/components/forms/AccountForm'
import { isGoogleAuthEnabled } from '@/utilities/googleAuth'

export default function SettingsPage() {
  return (
    <div className="rounded-[2rem] border bg-primary-foreground p-6 md:p-8">
      <h1 className="mb-2 text-3xl font-semibold">Profile settings</h1>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        Kelola identitas akun, koneksi Google, nomor HP, dan pengajuan penghapusan akun dari satu halaman.
      </p>
      <AccountForm googleEnabled={isGoogleAuthEnabled()} />
    </div>
  )
}
