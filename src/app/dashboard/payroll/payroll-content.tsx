"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, TrendingUp, Minus, Plus } from "lucide-react"
import type { Employee, Payroll } from "@/lib/types"

export function PayrollContent({ 
  employee, 
  isAdmin, 
  payrollRecords,
  allPayroll
}: { 
  employee: Employee
  isAdmin: boolean
  payrollRecords: Payroll[]
  allPayroll?: (Payroll & { employees: { first_name: string; last_name: string } })[]
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700">Paid</Badge>
      case "processed":
        return <Badge className="bg-blue-100 text-blue-700">Processed</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
    }
  }

  const latestPayroll = payrollRecords[0]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Payroll</h1>
        <p className="text-muted-foreground mt-1">
          {isAdmin ? "View and manage employee payroll" : "View your salary details and payment history"}
        </p>
      </div>

      {!isAdmin && latestPayroll && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Basic Salary</p>
                  <h3 className="text-2xl font-bold mt-1">{formatCurrency(latestPayroll.basic_salary)}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Allowances</p>
                  <h3 className="text-2xl font-bold mt-1">{formatCurrency(latestPayroll.allowances)}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md bg-gradient-to-br from-red-500/10 to-red-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Deductions</p>
                  <h3 className="text-2xl font-bold mt-1">{formatCurrency(latestPayroll.deductions)}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Minus className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Net Salary</p>
                  <h3 className="text-2xl font-bold mt-1">{formatCurrency(latestPayroll.net_salary)}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>{isAdmin ? "All Payroll Records" : "Payment History"}</CardTitle>
          <CardDescription>
            {isAdmin ? "Payroll records for all employees" : "Your salary payment history"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {isAdmin && <TableHead>Employee</TableHead>}
                <TableHead>Pay Period</TableHead>
                <TableHead className="text-right">Basic Salary</TableHead>
                <TableHead className="text-right">Allowances</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isAdmin ? allPayroll : payrollRecords)?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 7 : 6} className="text-center text-muted-foreground py-8">
                    No payroll records found
                  </TableCell>
                </TableRow>
              ) : (
                (isAdmin ? allPayroll : payrollRecords)?.map((record) => (
                  <TableRow key={record.id}>
                    {isAdmin && (
                      <TableCell className="font-medium">
                        {(record as Payroll & { employees: { first_name: string; last_name: string } }).employees?.first_name}{" "}
                        {(record as Payroll & { employees: { first_name: string; last_name: string } }).employees?.last_name}
                      </TableCell>
                    )}
                    <TableCell>
                      {new Date(record.pay_period_start).toLocaleDateString()} - {new Date(record.pay_period_end).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(record.basic_salary)}</TableCell>
                    <TableCell className="text-right text-green-600">+{formatCurrency(record.allowances)}</TableCell>
                    <TableCell className="text-right text-red-600">-{formatCurrency(record.deductions)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(record.net_salary)}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {!isAdmin && payrollRecords.length === 0 && (
        <Card className="shadow-md mt-6">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No Payroll Data Yet</h3>
            <p className="text-muted-foreground">
              Your payroll information will appear here once it&apos;s been set up by HR.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
