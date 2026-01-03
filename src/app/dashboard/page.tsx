import { redirect } from "next/navigation"
import { DashboardContent } from "./dashboard-content"
import { verifyAndGetEmployee, verifyAndGetUserWithRole } from '@/lib/auth-helper'
import { getDb } from '@/lib/mongodb'

export default async function DashboardPage() {
  const employee = await verifyAndGetEmployee()
  const user = await verifyAndGetUserWithRole()

  if (!employee || !user) {
    redirect('/auth/signin')
  }

  const isAdmin = (user.role === 'ADMIN' || user.role === 'admin')

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
    const db = await getDb()
    
    const [employees, leaveApplications] = await Promise.all([
      db.collection('employees').find({ is_active: true }).toArray(),
      db.collection('leave_applications').find({ status: 'PENDING' }).sort({ created_at: -1 }).limit(5).toArray()
    ])

    // Serialize ObjectId to strings
    const serializedEmployees = (employees || []).map(emp => ({
      ...emp,
      _id: emp._id?.toString() || '',
      user_id: emp.user_id?.toString() || ''
    }))

    const serializedLeaves = (leaveApplications || []).map(leave => ({
      ...leave,
      _id: leave._id?.toString() || '',
      employee_id: leave.employee_id?.toString() || ''
    }))

    dashboardData = {
      totalEmployees: serializedEmployees.length || 0,
      pendingLeaves: serializedLeaves.length || 0,
      todayAttendance: 0,
      recentLeaves: serializedLeaves,
      employees: serializedEmployees
    }
  }

  // Serialize employee ObjectIds
  const serializedEmployee = {
    ...employee,
    _id: employee._id?.toString() || '',
    user_id: employee.user_id?.toString() || ''
  }

  return <DashboardContent employee={serializedEmployee} isAdmin={isAdmin} dashboardData={dashboardData} />
}
