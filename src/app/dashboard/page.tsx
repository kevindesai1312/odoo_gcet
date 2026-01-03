import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardContent } from "./dashboard-content"
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export default async function DashboardPage() {
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

  const { data: employee } = await supabase
    .from('employees')
    .select('*')
    .eq('user_id', decoded.userId)
    .single()

  if (!employee) {
    redirect('/auth/signin')
  }

  const isAdmin = (decoded.role === 'ADMIN' || decoded.role === 'admin')

  let dashboardData: {
    totalEmployees: number
    pendingLeaves: number
    todayAttendance: number
    recentLeaves: unknown[]
    employees?: unknown[]
  } = {
    totalEmployees: 0,
    pendingLeaves: 0,
    todayAttendance: 0,
    recentLeaves: []
  }

  if (isAdmin) {
    const [employeesRes, leavesRes] = await Promise.all([
      supabase.from('employees').select('*').eq('is_active', true),
      supabase.from('leave_applications').select('*, employees(first_name, last_name)').eq('status', 'PENDING').order('created_at', { ascending: false }).limit(5),
    ])

    dashboardData = {
      totalEmployees: employeesRes.data?.length || 0,
      pendingLeaves: leavesRes.data?.length || 0,
      todayAttendance: 0,
      recentLeaves: leavesRes.data || [],
      employees: employeesRes.data || []
    }
  }

  return <DashboardContent employee={employee} isAdmin={isAdmin} dashboardData={dashboardData} />

}
