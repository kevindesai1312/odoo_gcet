import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AttendanceContent } from "./attendance-content"

export default async function AttendancePage() {
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
  const today = new Date().toISOString().split("T")[0]
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  let todayAttendance = null
  let weeklyAttendance: unknown[] = []
  let allAttendance: unknown[] = []

  if (isAdmin) {
    const { data } = await supabase
      .from("attendance")
      .select("*, employees(first_name, last_name)")
      .order("date", { ascending: false })
      .limit(50)
    allAttendance = data || []
  } else {
    const [todayRes, weeklyRes] = await Promise.all([
      supabase
        .from("attendance")
        .select("*")
        .eq("employee_id", employee.id)
        .eq("date", today)
        .single(),
      supabase
        .from("attendance")
        .select("*")
        .eq("employee_id", employee.id)
        .gte("date", weekAgo)
        .order("date", { ascending: false })
    ])
    
    todayAttendance = todayRes.data
    weeklyAttendance = weeklyRes.data || []
  }

  return (
    <AttendanceContent 
      employee={employee} 
      isAdmin={isAdmin}
      todayAttendance={todayAttendance}
      weeklyAttendance={weeklyAttendance as []}
      allAttendance={allAttendance as []}
    />
  )
}
