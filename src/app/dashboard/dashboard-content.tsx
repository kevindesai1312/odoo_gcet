"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Users, 
  Clock, 
  Calendar, 
  DollarSign, 
  ArrowRight, 
  User,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"
import type { Employee, LeaveRequest } from "@/lib/types"
import { motion } from "framer-motion"

type DashboardData = {
  totalEmployees: number
  pendingLeaves: number
  todayAttendance: number
  recentLeaves: (LeaveRequest & { employees?: { first_name: string; last_name: string } })[]
  employees?: Employee[]
}

export function DashboardContent({ 
  employee, 
  isAdmin, 
  dashboardData 
}: { 
  employee: Employee
  isAdmin: boolean
  dashboardData: DashboardData
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
            Welcome back, {employee.first_name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Here's an overview of your organization" : "Here's your personal dashboard"}
          </p>
        </motion.div>

        {isAdmin ? (
          <>
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-md bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                      <h3 className="text-3xl font-bold mt-1">{dashboardData.totalEmployees}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Active workforce</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-green-500/10 to-green-500/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Today&apos;s Attendance</p>
                      <h3 className="text-3xl font-bold mt-1">{dashboardData.todayAttendance}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-sm text-muted-foreground">
                    <span>Checked in today</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Leaves</p>
                      <h3 className="text-3xl font-bold mt-1">{dashboardData.pendingLeaves}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-sm text-muted-foreground">
                    <span>Awaiting approval</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Payroll Status</p>
                      <h3 className="text-xl font-bold mt-1">Processed</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-sm text-muted-foreground">
                    <span>This month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Pending Leave Requests</CardTitle>
                    <CardDescription>Recent leave applications awaiting approval</CardDescription>
                  </div>
                  <Link href="/dashboard/leave">
                    <Button variant="ghost" size="sm">
                      View all <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {dashboardData.recentLeaves.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.recentLeaves.map((leave) => (
                        <div key={leave.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {leave.employees?.first_name?.[0]}{leave.employees?.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{leave.employees?.first_name} {leave.employees?.last_name}</p>
                              <p className="text-sm text-muted-foreground capitalize">{leave.leave_type} leave</p>
                            </div>
                          </div>
                          {getStatusBadge(leave.status)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No pending leave requests</p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Employees</CardTitle>
                    <CardDescription>Latest team members</CardDescription>
                  </div>
                  <Link href="/dashboard/employees">
                    <Button variant="ghost" size="sm">
                      View all <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {dashboardData.employees && dashboardData.employees.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.employees.slice(0, 5).map((emp: Employee) => (
                        <div key={emp.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {emp.first_name?.[0]}{emp.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{emp.first_name} {emp.last_name}</p>
                              <p className="text-sm text-muted-foreground">{emp.position || emp.department || "Employee"}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="capitalize">{emp.role}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No employees found</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Link href="/dashboard/profile">
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">Profile</h3>
                    <p className="text-sm text-muted-foreground mt-1">View & edit your profile</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/attendance">
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-500/10 to-green-500/5">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Attendance</h3>
                    <p className="text-sm text-muted-foreground mt-1">Check in/out & view history</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/leave">
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4">
                      <Calendar className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Leave Requests</h3>
                    <p className="text-sm text-muted-foreground mt-1">{dashboardData.pendingLeaves} pending requests</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/payroll">
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Payroll</h3>
                    <p className="text-sm text-muted-foreground mt-1">View salary details</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Recent Leave Requests</CardTitle>
                  <CardDescription>Your recent leave applications</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.recentLeaves.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.recentLeaves.map((leave) => (
                        <div key={leave.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium capitalize">{leave.leave_type} Leave</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                            </p>
                          </div>
                          {getStatusBadge(leave.status)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No leave requests yet</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  )
}
