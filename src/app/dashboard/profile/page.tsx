import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileContent } from "./profile-content"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('token')
  const token = tokenCookie?.value

  if (!token) {
    redirect('/auth/signin')
  }

  const decoded = verifyToken(token || '')
  if (!decoded) {
    redirect('/auth/signin')
  }

  const supabase = await createClient()

  const { data: currentEmployee } = await supabase
    .from("employees")
    .select("*")
    .eq("user_id", decoded.userId)
    .single()

  if (!currentEmployee) {
    redirect("/auth/signin")
  }

  const isAdmin = decoded.role === 'ADMIN'

  return <ProfileContent employee={currentEmployee} isAdmin={isAdmin} />
}
