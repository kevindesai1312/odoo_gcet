"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Briefcase, 
  Calendar, 
  Edit, 
  ArrowLeft,
  User,
  Award,
  DollarSign,
  FileText
} from "lucide-react"
import { motion } from "framer-motion"
import type { Employee } from "@/lib/types"

export function ProfileContent({ employee, isAdmin }: { employee: Employee; isAdmin?: boolean }) {
  const getInitials = () => {
    return `${employee.first_name?.[0] || ""}${employee.last_name?.[0] || ""}`.toUpperCase()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 lg:p-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={employee.profile_picture || ''} />
              <AvatarFallback className="bg-primary/10 text-lg font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{employee.first_name} {employee.last_name}</h1>
              <p className="text-muted-foreground mt-1">{employee.position || 'Employee'}</p>
              <Badge className="mt-3">{employee.is_active ? 'Active' : 'Inactive'}</Badge>
            </div>
          </div>
          <Link href="/dashboard/profile/edit">
            <Button className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="job">Job</TabsTrigger>
            <TabsTrigger value="salary">Salary</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Personal Details Tab */}
          <TabsContent value="personal" className="mt-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <User className="w-4 h-4" />
                      First Name
                    </label>
                    <p className="text-base font-medium">{employee.first_name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Last Name
                    </label>
                    <p className="text-base font-medium">{employee.last_name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <p className="text-base font-medium">{employee.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </label>
                    <p className="text-base font-medium">{employee.phone || 'Not provided'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </label>
                    <p className="text-base font-medium">{employee.address || 'Not provided'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">City/State</label>
                    <p className="text-base font-medium">{employee.city ? `${employee.city}${employee.state ? ', ' + employee.state : ''}` : 'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Details Tab */}
          <TabsContent value="job" className="mt-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
                <CardDescription>Your employment details and position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Position
                    </label>
                    <p className="text-base font-medium">{employee.position || 'Not assigned'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Department
                    </label>
                    <p className="text-base font-medium">{employee.department || 'Not assigned'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Hire Date
                    </label>
                    <p className="text-base font-medium">
                      {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : 'Not provided'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Employment Status
                    </label>
                    <p className="text-base font-medium capitalize">{employee.employment_type || 'Full-time'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Manager</label>
                    <p className="text-base font-medium">{employee.manager_name || 'Not assigned'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                    <p className="text-base font-medium">{employee.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Salary Structure Tab */}
          <TabsContent value="salary" className="mt-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Salary Structure</CardTitle>
                <CardDescription>Your compensation details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Base Salary
                    </label>
                    <p className="text-lg font-bold">
                      ${(employee.salary || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Currency
                    </label>
                    <p className="text-base font-medium">{employee.salary_currency || 'USD'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Pay Frequency</label>
                    <p className="text-base font-medium capitalize">{employee.pay_frequency || 'Monthly'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Benefits</label>
                    <p className="text-base font-medium">{employee.benefits || 'Standard'}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground italic">
                    For detailed salary breakdown including allowances and deductions, please contact HR.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="mt-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Your employment documents and certificates</CardDescription>
              </CardHeader>
              <CardContent>
                {employee.documents && employee.documents.length > 0 ? (
                  <div className="space-y-3">
                    {employee.documents.map((doc: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border">
                        <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium">{doc.name || `Document ${idx + 1}`}</p>
                          <p className="text-sm text-muted-foreground">{doc.type || 'PDF'}</p>
                        </div>
                        <Button variant="outline" size="sm">Download</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No documents uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
