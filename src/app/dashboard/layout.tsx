import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/signin")
  }

  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav employee={employee} />
      <main className="flex-1 lg:pt-0 pt-16">
        {children}
      </main>
    </div>
  )
}
