import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LeaveContent } from "./leave-content"

export default async function LeavePage() {
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

  let leaveRequests: unknown[] = []
  let allLeaveRequests: unknown[] = []

  if (isAdmin) {
    const { data } = await supabase
      .from("leave_requests")
      .select("*, employees(first_name, last_name)")
      .order("created_at", { ascending: false })
    allLeaveRequests = data || []
  } else {
    const { data } = await supabase
      .from("leave_requests")
      .select("*")
      .eq("employee_id", employee.id)
      .order("created_at", { ascending: false })
    leaveRequests = data || []
  }

  return (
    <LeaveContent 
      employee={employee} 
      isAdmin={isAdmin}
      leaveRequests={leaveRequests as []}
      allLeaveRequests={allLeaveRequests as []}
    />
  )
}
