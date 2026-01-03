import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PayrollContent } from "./payroll-content"

export default async function PayrollPage() {
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

  let payrollRecords: unknown[] = []
  let allPayroll: unknown[] = []

  if (isAdmin) {
    const { data } = await supabase
      .from("payroll")
      .select("*, employees(first_name, last_name)")
      .order("pay_period_end", { ascending: false })
    allPayroll = data || []
  } else {
    const { data } = await supabase
      .from("payroll")
      .select("*")
      .eq("employee_id", employee.id)
      .order("pay_period_end", { ascending: false })
    payrollRecords = data || []
  }

  return (
    <PayrollContent 
      employee={employee} 
      isAdmin={isAdmin}
      payrollRecords={payrollRecords as []}
      allPayroll={allPayroll as []}
    />
  )
}
