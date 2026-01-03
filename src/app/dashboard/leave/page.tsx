import { redirect } from "next/navigation"
import { LeaveContent } from "./leave-content"
import { verifyAndGetEmployee } from '@/lib/auth-helper'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function LeavePage() {
  const employee = await verifyAndGetEmployee()
  
  if (!employee) {
    redirect("/auth/signin")
  }

  const isAdmin = employee.role === "admin" || employee.role === "hr"

  let leaveRequests: unknown[] = []
  let allLeaveRequests: unknown[] = []

  try {
    const db = await getDb()
    const employeeObjectId = new ObjectId(employee._id)

    if (isAdmin) {
      const leaves = await db.collection('leave_applications')
        .find({})
        .sort({ created_at: -1 })
        .toArray()
      
      allLeaveRequests = leaves.map(leave => ({
        ...leave,
        _id: leave._id?.toString() || '',
        employee_id: leave.employee_id?.toString() || ''
      }))
    } else {
      const leaves = await db.collection('leave_applications')
        .find({ employee_id: employeeObjectId })
        .sort({ created_at: -1 })
        .toArray()
      
      leaveRequests = leaves.map(leave => ({
        ...leave,
        _id: leave._id?.toString() || '',
        employee_id: leave.employee_id?.toString() || ''
      }))
    }
  } catch (error) {
    console.error('Error fetching leave data:', error)
  }

  const serializedEmployee = {
    ...employee,
    _id: employee._id?.toString() || '',
    user_id: employee.user_id?.toString() || ''
  }

  return (
    <LeaveContent 
      employee={serializedEmployee} 
      isAdmin={isAdmin}
      leaveRequests={leaveRequests as []}
      allLeaveRequests={allLeaveRequests as []}
    />
  )
}
