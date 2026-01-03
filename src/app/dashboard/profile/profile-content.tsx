"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2, Mail, Phone, MapPin, Building, Briefcase, Calendar, Edit2, Save, X } from "lucide-react"
import type { Employee } from "@/lib/types"
import { useRouter } from "next/navigation"

export function ProfileContent({ employee }: { employee: Employee }) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    phone: employee.phone || "",
    address: employee.address || "",
  })
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    const { error } = await supabase
      .from("employees")
      .update({
        phone: formData.phone,
        address: formData.address,
        updated_at: new Date().toISOString()
      })
      .eq("id", employee.id)

    if (error) {
      toast.error("Failed to update profile")
    } else {
      toast.success("Profile updated successfully")
      setEditing(false)
      router.refresh()
    }
    setLoading(false)
  }

  const getInitials = () => {
    return `${employee.first_name?.[0] || ""}${employee.last_name?.[0] || ""}`.toUpperCase()
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Profile</h1>
        <p className="text-muted-foreground mt-1">View and manage your personal information</p>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl gradient-bg text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{employee.first_name} {employee.last_name}</h2>
                  <Badge variant="secondary" className="capitalize">{employee.role}</Badge>
                  <Badge className={employee.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                    {employee.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{employee.position || "Employee"} {employee.department ? `• ${employee.department}` : ""}</p>
                <p className="text-sm text-muted-foreground mt-1">Employee ID: {employee.employee_id}</p>
              </div>
              {!editing && (
                <Button onClick={() => setEditing(true)} variant="outline">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  {editing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{employee.phone || "Not provided"}</p>
                  )}
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Address</p>
                  {editing ? (
                    <Textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter address"
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="font-medium">{employee.address || "Not provided"}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
              <CardDescription>Your employment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{employee.department || "Not assigned"}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">{employee.position || "Not assigned"}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Hire Date</p>
                  <p className="font-medium">
                    {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : "Not set"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {editing && (
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => {
              setEditing(false)
              setFormData({
                phone: employee.phone || "",
                address: employee.address || "",
              })
            }}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
