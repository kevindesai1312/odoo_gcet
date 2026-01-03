"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { Loader2, Plus, CalendarIcon, CheckCircle2, XCircle, AlertCircle, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Employee, LeaveRequest } from "@/lib/types"
import { useRouter } from "next/navigation"

export function LeaveContent({ 
  employee, 
  isAdmin, 
  leaveRequests,
  allLeaveRequests
}: { 
  employee: Employee
  isAdmin: boolean
  leaveRequests: LeaveRequest[]
  allLeaveRequests?: (LeaveRequest & { employees: { first_name: string; last_name: string } })[]
}) {
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null)
  const [adminComment, setAdminComment] = useState("")
  const [formData, setFormData] = useState({
    leaveType: "paid" as "paid" | "sick" | "unpaid",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    remarks: ""
  })
  const router = useRouter()
  const supabase = createClient()

  const handleSubmitLeave = async () => {
    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select start and end dates")
      return
    }

    setLoading(true)
    const { error } = await supabase.from("leave_requests").insert({
      employee_id: employee.id,
      leave_type: formData.leaveType,
      start_date: formData.startDate.toISOString().split("T")[0],
      end_date: formData.endDate.toISOString().split("T")[0],
      remarks: formData.remarks,
      status: "pending"
    })

    if (error) {
      toast.error("Failed to submit leave request")
    } else {
      toast.success("Leave request submitted successfully!")
      setDialogOpen(false)
      setFormData({ leaveType: "paid", startDate: undefined, endDate: undefined, remarks: "" })
      router.refresh()
    }
    setLoading(false)
  }

  const handleApproval = async (status: "approved" | "rejected") => {
    if (!selectedLeave) return
    setLoading(true)

    const { error } = await supabase
      .from("leave_requests")
      .update({ 
        status, 
        admin_comment: adminComment,
        approved_by: employee.id,
        updated_at: new Date().toISOString()
      })
      .eq("id", selectedLeave.id)

    if (error) {
      toast.error("Failed to update leave request")
    } else {
      toast.success(`Leave request ${status}!`)
      setApprovalDialogOpen(false)
      setSelectedLeave(null)
      setAdminComment("")
      router.refresh()
    }
    setLoading(false)
  }

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

  const getLeaveTypeBadge = (type: string) => {
    switch (type) {
      case "paid":
        return <Badge variant="outline" className="border-green-500 text-green-600">Paid</Badge>
      case "sick":
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Sick</Badge>
      case "unpaid":
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Unpaid</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
            {isAdmin ? "Leave Management" : "Leave Requests"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Review and manage employee leave requests" : "Apply for leave and track your requests"}
          </p>
        </div>
        {!isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-bg border-0">
                <Plus className="w-4 h-4 mr-2" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>Submit a new leave request for approval</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <Select value={formData.leaveType} onValueChange={(v: "paid" | "sick" | "unpaid") => setFormData({ ...formData, leaveType: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.startDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={formData.startDate} onSelect={(d) => setFormData({ ...formData, startDate: d })} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.endDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={formData.endDate} onSelect={(d) => setFormData({ ...formData, endDate: d })} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Remarks (Optional)</Label>
                  <Textarea
                    placeholder="Add any additional notes..."
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmitLeave} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>{isAdmin ? "All Leave Requests" : "Your Leave Requests"}</CardTitle>
          <CardDescription>
            {isAdmin ? "Review and approve/reject leave requests" : "Track the status of your leave applications"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {isAdmin && <TableHead>Employee</TableHead>}
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
                {isAdmin && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isAdmin ? allLeaveRequests : leaveRequests)?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 7 : 6} className="text-center text-muted-foreground py-8">
                    No leave requests found
                  </TableCell>
                </TableRow>
              ) : (
                (isAdmin ? allLeaveRequests : leaveRequests)?.map((leave) => (
                  <TableRow key={leave.id}>
                    {isAdmin && (
                      <TableCell className="font-medium">
                        {(leave as LeaveRequest & { employees: { first_name: string; last_name: string } }).employees?.first_name}{" "}
                        {(leave as LeaveRequest & { employees: { first_name: string; last_name: string } }).employees?.last_name}
                      </TableCell>
                    )}
                    <TableCell>{getLeaveTypeBadge(leave.leave_type)}</TableCell>
                    <TableCell>{new Date(leave.start_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(leave.end_date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{leave.remarks || "-"}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        {leave.status === "pending" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedLeave(leave)
                              setApprovalDialogOpen(true)
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Leave Request</DialogTitle>
            <DialogDescription>Approve or reject this leave request</DialogDescription>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Leave Type</p>
                  <p className="font-medium capitalize">{selectedLeave.leave_type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {new Date(selectedLeave.start_date).toLocaleDateString()} - {new Date(selectedLeave.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {selectedLeave.remarks && (
                <div>
                  <p className="text-sm text-muted-foreground">Employee Remarks</p>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{selectedLeave.remarks}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label>Admin Comment (Optional)</Label>
                <Textarea
                  placeholder="Add a comment for the employee..."
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setApprovalDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleApproval("rejected")} disabled={loading}>
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
            <Button onClick={() => handleApproval("approved")} disabled={loading} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
