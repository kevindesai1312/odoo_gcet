import { redirect } from "next/navigation"
import { ProfileContent } from "./profile-content"
import { verifyAndGetEmployee } from '@/lib/auth-helper'

export default async function ProfilePage() {
  const currentEmployee = await verifyAndGetEmployee()

  if (!currentEmployee) {
    redirect('/auth/signin')
  }

  const isAdmin = currentEmployee.role === 'ADMIN'

  const serializedEmployee = {
    ...currentEmployee,
    _id: currentEmployee._id?.toString() || '',
    user_id: currentEmployee.user_id?.toString() || ''
  }

  return <ProfileContent employee={serializedEmployee} isAdmin={isAdmin} />
}
