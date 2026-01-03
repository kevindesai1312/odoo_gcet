import { redirect } from "next/navigation"
import { PayrollContent } from "./payroll-content"
import { verifyAndGetEmployee } from '@/lib/auth-helper'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function PayrollPage() {
  const employee = await verifyAndGetEmployee()
  
  if (!employee) {
    redirect("/auth/signin")
  }

  const isAdmin = employee.role === "admin" || employee.role === "hr"

  let payrollRecords: unknown[] = []
  let allPayroll: unknown[] = []

  try {
    const db = await getDb()
    const employeeObjectId = new ObjectId(employee._id)

    if (isAdmin) {
      const payroll = await db.collection('payroll')
        .find({})
        .sort({ pay_period_end: -1 })
        .toArray()
      
      allPayroll = payroll.map(record => ({
        ...record,
        _id: record._id?.toString() || '',
        employee_id: record.employee_id?.toString() || ''
      }))
    } else {
      const payroll = await db.collection('payroll')
        .find({ employee_id: employeeObjectId })
        .sort({ pay_period_end: -1 })
        .toArray()
      
      payrollRecords = payroll.map(record => ({
        ...record,
        _id: record._id?.toString() || '',
        employee_id: record.employee_id?.toString() || ''
      }))
    }
  } catch (error) {
    console.error('Error fetching payroll data:', error)
  }

  const serializedEmployee = {
    ...employee,
    _id: employee._id?.toString() || '',
    user_id: employee.user_id?.toString() || ''
  }

  return (
    <PayrollContent 
      employee={serializedEmployee} 
      isAdmin={isAdmin}
      payrollRecords={payrollRecords as []}
      allPayroll={allPayroll as []}
    />
  )
}
