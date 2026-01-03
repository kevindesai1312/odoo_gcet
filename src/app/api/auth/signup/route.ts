import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email, password, employeeId, firstName, lastName, role } = await request.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  if (authData.user) {
    const { error: employeeError } = await supabase.from("employees").insert({
      user_id: authData.user.id,
      employee_id: employeeId,
      email: email,
      first_name: firstName,
      last_name: lastName,
      role: role,
    })

    if (employeeError) {
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: employeeError.message }, { status: 400 })
    }
  }

  return NextResponse.json({ success: true, user: authData.user })
}
