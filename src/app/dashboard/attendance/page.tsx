import { redirect } from "next/navigation"
import { AttendanceContent } from "./attendance-content"
import { verifyAndGetEmployee } from '@/lib/auth-helper'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function AttendancePage() {
  const employee = await verifyAndGetEmployee()
  
  if (!employee) {
    redirect("/auth/signin")
  }

  const isAdmin = employee.role === "admin" || employee.role === "hr"
  const today = new Date().toISOString().split("T")[0]
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  let todayAttendance = null
  let weeklyAttendance: unknown[] = []
  let allAttendance: unknown[] = []

  try {
    const db = await getDb()
    const employeeObjectId = new ObjectId(employee._id)

    if (isAdmin) {
      const attendance = await db.collection('attendance')
        .find({})
        .sort({ date: -1 })
        .limit(50)
        .toArray()
      
      allAttendance = attendance.map(att => ({
        ...att,
        _id: att._id?.toString() || '',
        employee_id: att.employee_id?.toString() || ''
      }))
    } else {
      const [todayRes, weeklyRes] = await Promise.all([
        db.collection('attendance').findOne({ 
          employee_id: employeeObjectId, 
          date: today 
        }),
        db.collection('attendance').find({ 
          employee_id: employeeObjectId, 
          date: { $gte: weekAgo } 
        }).sort({ date: -1 }).toArray()
      ])
      
      todayAttendance = todayRes ? {
        ...todayRes,
        _id: todayRes._id?.toString() || '',
        employee_id: todayRes.employee_id?.toString() || ''
      } : null

      weeklyAttendance = weeklyRes.map(att => ({
        ...att,
        _id: att._id?.toString() || '',
        employee_id: att.employee_id?.toString() || ''
      }))
    }
  } catch (error) {
    console.error('Error fetching attendance data:', error)
  }

  const serializedEmployee = {
    ...employee,
    _id: employee._id?.toString() || '',
    user_id: employee.user_id?.toString() || ''
  }

  return (
    <AttendanceContent 
      employee={serializedEmployee} 
      isAdmin={isAdmin}
      todayAttendance={todayAttendance}
      weeklyAttendance={weeklyAttendance as []}
      allAttendance={allAttendance as []}
    />
  )
}
