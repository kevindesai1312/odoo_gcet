"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Upload, User, Mail, Phone, MapPin, Save } from "lucide-react"
import { motion } from "framer-motion"
import type { Employee } from "@/lib/types"

export function EditProfileContent({ employee, isAdmin }: { employee: Employee; isAdmin?: boolean }) {
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [preview, setPreview] = useState(employee.profile_picture || '')
  const [formData, setFormData] = useState({
    phone: employee.phone || "",
    address: employee.address || "",
    city: employee.city || "",
    state: employee.state || "",
    zip_code: employee.zip_code || "",
    position: employee.position || "",
    department: employee.department || "",
    salary: employee.salary || null,
    employment_type: employee.employment_type || "",
  })
  const router = useRouter()
  const supabase = createClient()

  const getInitials = () => {
    return `${employee.first_name?.[0] || ""}${employee.last_name?.[0] || ""}`.toUpperCase()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Update profile image if provided
      let imageUrl = employee.profile_picture
      if (profileImage) {
        const fileName = `${employee.id}-${Date.now()}`
        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(fileName, profileImage, { upsert: true })

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('profiles')
          .getPublicUrl(fileName)
        
        imageUrl = data?.publicUrl
      }

      // Update employee record
      const { error } = await supabase
        .from('employees')
        .update({
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          ...(isAdmin && {
            position: formData.position,
            department: formData.department,
            salary: formData.salary,
            employment_type: formData.employment_type,
          }),
          profile_picture: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', employee.id)

      if (error) throw error

      toast.success('Profile updated successfully')
      router.push('/dashboard/profile')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
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
      className="p-6 lg:p-8 max-w-3xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <Link href="/dashboard/profile" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to profile
        </Link>
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <p className="text-muted-foreground mt-1">Update your personal information</p>
      </motion.div>

      {/* Profile Picture Section */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-md mb-6">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Upload a new profile picture (optional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 border-2 border-primary flex-shrink-0">
                <AvatarImage src={preview} />
                <AvatarFallback className="bg-primary/10 text-lg font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm font-medium">Click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Information */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-md mb-6">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Update your phone number and address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email (Read-only)
                </Label>
                <Input
                  id="email"
                  value={employee.email}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Street Address
              </Label>
              <Input
                id="address"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  placeholder="10001"
                  value={formData.zip_code}
                  onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Read-only Job Info */}
      <motion.div variants={itemVariants}>
        <Card className={`shadow-md mb-6 ${!isAdmin ? 'opacity-75' : ''}`}>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
            <CardDescription>{isAdmin ? 'Manage employee job details' : 'Contact HR to modify job details'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Position</Label>
                {isAdmin ? (
                  <Input
                    placeholder="e.g., Senior Engineer"
                    value={formData.position || ''}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                ) : (
                  <p className="font-medium">{employee.position || 'Not assigned'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Department</Label>
                {isAdmin ? (
                  <Input
                    placeholder="e.g., Engineering"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                ) : (
                  <p className="font-medium">{employee.department || 'Not assigned'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Salary</Label>
                {isAdmin ? (
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.salary || ''}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value ? parseFloat(e.target.value) : null })}
                  />
                ) : (
                  <p className="font-medium">${(employee.salary || 0).toLocaleString()}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Employment Type</Label>
                {isAdmin ? (
                  <Input
                    placeholder="e.g., Full-time"
                    value={formData.employment_type || ''}
                    onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                  />
                ) : (
                  <p className="font-medium">{employee.employment_type || 'Not assigned'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex justify-end gap-3">
        <Link href="/dashboard/profile">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
}
