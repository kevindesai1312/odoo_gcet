import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardContent } from "./dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/signin")
  }

  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!employee) {
    redirect("/auth/signin")
  }

  const isAdmin = employee.role === "admin" || employee.role === "hr"

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
    const [employeesRes, leavesRes, attendanceRes] = await Promise.all([
      supabase.from("employees").select("*").eq("status", "active"),
      supabase.from("leave_requests").select("*, employees(first_name, last_name)").eq("status", "pending").order("created_at", { ascending: false }).limit(5),
      supabase.from("attendance").select("*").eq("date", new Date().toISOString().split("T")[0])
    ])

    dashboardData = {
      totalEmployees: employeesRes.data?.length || 0,
      pendingLeaves: leavesRes.data?.length || 0,
      todayAttendance: attendanceRes.data?.length || 0,
      recentLeaves: leavesRes.data || [],
      employees: employeesRes.data || []
    }
  } else {
    const [leavesRes, attendanceRes] = await Promise.all([
      supabase.from("leave_requests").select("*").eq("employee_id", employee.id).order("created_at", { ascending: false }).limit(5),
      supabase.from("attendance").select("*").eq("employee_id", employee.id).eq("date", new Date().toISOString().split("T")[0]).single()
    ])

    dashboardData = {
      totalEmployees: 0,
      pendingLeaves: leavesRes.data?.filter((l: { status: string }) => l.status === "pending").length || 0,
      todayAttendance: attendanceRes.data ? 1 : 0,
      recentLeaves: leavesRes.data || []
    }
  }

  return <DashboardContent employee={employee} isAdmin={isAdmin} dashboardData={dashboardData} />
}
