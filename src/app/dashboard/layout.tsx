import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) {
    redirect("/auth/signin")
  }

  let userId: string | null = null
  try {
    const verified = await jwtVerify(token, secret)
    userId = verified.payload.userId as string
  } catch {
    redirect("/auth/signin")
  }

  const db = await getDb()
  const employee = await db.collection('employees').findOne({ 
    user_id: new ObjectId(userId) 
  })

  const serializedEmployee = employee ? {
    ...employee,
    _id: employee._id?.toString() || '',
    user_id: employee.user_id?.toString() || ''
  } : null

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav employee={serializedEmployee} />
      <main className="flex-1 lg:pt-0 pt-16">
        {children}
      </main>
    </div>
  )
}
