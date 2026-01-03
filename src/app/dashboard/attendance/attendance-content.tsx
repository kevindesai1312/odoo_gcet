"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Clock, LogIn, LogOut, Calendar } from "lucide-react"
import type { Employee, Attendance } from "@/lib/types"
import { useRouter } from "next/navigation"

export function AttendanceContent({ 
  employee, 
  isAdmin, 
  todayAttendance,
  weeklyAttendance,
  allAttendance
}: { 
  employee: Employee
  isAdmin: boolean
  todayAttendance: Attendance | null
  weeklyAttendance: Attendance[]
  allAttendance?: (Attendance & { employees: { first_name: string; last_name: string } })[]
}) {
  const [loading, setLoading] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")
  const router = useRouter()
  const supabase = createClient()

  const handleCheckIn = async () => {
    setLoading(true)
    const now = new Date()
    const today = now.toISOString().split("T")[0]

    const { error } = await supabase.from("attendance").insert({
      employee_id: employee.id,
      date: today,
      check_in: now.toISOString(),
      status: "present"
    })

    if (error) {
      if (error.code === "23505") {
        toast.error("You have already checked in today")
      } else {
        toast.error("Failed to check in")
      }
    } else {
      toast.success("Checked in successfully!")
      router.refresh()
    }
    setLoading(false)
  }

  const handleCheckOut = async () => {
    if (!todayAttendance) return
    setLoading(true)

    const { error } = await supabase
      .from("attendance")
      .update({ check_out: new Date().toISOString() })
      .eq("id", todayAttendance.id)

    if (error) {
      toast.error("Failed to check out")
    } else {
      toast.success("Checked out successfully!")
      router.refresh()
    }
    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-700">Present</Badge>
      case "absent":
        return <Badge className="bg-red-100 text-red-700">Absent</Badge>
      case "half-day":
        return <Badge className="bg-yellow-100 text-yellow-700">Half-day</Badge>
      case "leave":
        return <Badge className="bg-blue-100 text-blue-700">Leave</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatTime = (time: string | null) => {
    if (!time) return "-"
    return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const filteredAttendance = allAttendance?.filter(a => 
    selectedEmployee === "all" || a.employee_id === selectedEmployee
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Attendance</h1>
        <p className="text-muted-foreground mt-1">
          {isAdmin ? "View and manage employee attendance" : "Track your daily attendance"}
        </p>
      </div>

      {!isAdmin && (
        <Card className="shadow-md mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Today&apos;s Attendance
            </CardTitle>
            <CardDescription>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Check In</p>
                  <p className="text-2xl font-bold">{formatTime(todayAttendance?.check_in || null)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check Out</p>
                  <p className="text-2xl font-bold">{formatTime(todayAttendance?.check_out || null)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">
                    {todayAttendance ? getStatusBadge(todayAttendance.status) : <Badge variant="outline">Not checked in</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {!todayAttendance && (
                  <Button onClick={handleCheckIn} disabled={loading} className="gradient-bg border-0">
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <LogIn className="w-4 h-4 mr-2" />
                    )}
                    Check In
                  </Button>
                )}
                {todayAttendance && !todayAttendance.check_out && (
                  <Button onClick={handleCheckOut} disabled={loading} variant="outline">
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4 mr-2" />
                    )}
                    Check Out
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {isAdmin ? "All Attendance Records" : "Weekly Attendance"}
            </CardTitle>
            <CardDescription>
              {isAdmin ? "Attendance records for all employees" : "Your attendance history for this week"}
            </CardDescription>
          </div>
          {isAdmin && (
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
              </SelectContent>
            </Select>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {isAdmin && <TableHead>Employee</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isAdmin ? filteredAttendance : weeklyAttendance)?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 5 : 4} className="text-center text-muted-foreground py-8">
                    No attendance records found
                  </TableCell>
                </TableRow>
              ) : (
                (isAdmin ? filteredAttendance : weeklyAttendance)?.map((record) => (
                  <TableRow key={record.id}>
                    {isAdmin && (
                      <TableCell className="font-medium">
                        {(record as Attendance & { employees: { first_name: string; last_name: string } }).employees?.first_name}{" "}
                        {(record as Attendance & { employees: { first_name: string; last_name: string } }).employees?.last_name}
                      </TableCell>
                    )}
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatTime(record.check_in)}</TableCell>
                    <TableCell>{formatTime(record.check_out)}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
