import { redirect } from "next/navigation"
import { EmployeesContent } from "./employees-content"
import { verifyAndGetEmployee } from '@/lib/auth-helper'
import { getDb } from '@/lib/mongodb'

export default async function EmployeesPage() {
  const employee = await verifyAndGetEmployee()
  
  if (!employee) {
    redirect("/auth/signin")
  }

  const isAdmin = employee.role === "admin" || employee.role === "hr"

  if (!isAdmin) {
    redirect("/dashboard")
  }

  let employees: unknown[] = []

  try {
    const db = await getDb()
    const emps = await db.collection('employees')
      .find({ is_active: true })
      .sort({ created_at: -1 })
      .toArray()
    
    employees = emps.map(emp => ({
      ...emp,
      _id: emp._id?.toString() || '',
      user_id: emp.user_id?.toString() || ''
    }))
  } catch (error) {
    console.error('Error fetching employees:', error)
  }

  return <EmployeesContent employees={employees || []} />
}
