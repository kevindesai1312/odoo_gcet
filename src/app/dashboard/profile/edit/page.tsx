import { redirect } from "next/navigation"
import { EditProfileContent } from "./edit-profile-content"
import { verifyAndGetUserWithRole } from '@/lib/auth-helper'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function EditProfilePage() {
  const user = await verifyAndGetUserWithRole()

  if (!user) {
    redirect('/auth/signin')
  }

  const db = await getDb()
  const currentEmployee = await db.collection('employees').findOne({
    user_id: new ObjectId(user.userId)
  })

  if (!currentEmployee) {
    redirect("/auth/signin")
  }

  const isAdmin = user.role === 'ADMIN'

  const serializedEmployee = {
    ...currentEmployee,
    _id: currentEmployee._id?.toString() || '',
    user_id: currentEmployee.user_id?.toString() || ''
  }

  return <EditProfileContent employee={serializedEmployee} isAdmin={isAdmin} />
}
