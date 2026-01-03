import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Clock, Calendar, DollarSign, Shield, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-bold text-xl" style={{ fontFamily: 'Sora, sans-serif' }}>Dayflow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="gradient-bg border-0">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.55_0.22_260/0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,oklch(0.65_0.18_180/0.06),transparent_50%)]" />
          <div className="max-w-7xl mx-auto relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                <Shield className="w-4 h-4" />
                Enterprise-grade HR Management
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
                Every workday,{" "}
                <span className="bg-gradient-to-r from-primary to-[oklch(0.65_0.18_180)] bg-clip-text text-transparent">
                  perfectly aligned
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Streamline your HR operations with Dayflow. Manage employees, track attendance, 
                handle leave requests, and oversee payroll - all in one elegant platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="gradient-bg border-0 h-12 px-8 text-base">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-20 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
              <div className="rounded-2xl border bg-card shadow-2xl overflow-hidden">
                <div className="h-10 bg-muted flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="p-8 bg-gradient-to-br from-muted/30 to-muted/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card rounded-xl p-6 shadow-sm border">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">128</h3>
                      <p className="text-sm text-muted-foreground">Active Employees</p>
                    </div>
                    <div className="bg-card rounded-xl p-6 shadow-sm border">
                      <div className="w-12 h-12 rounded-lg bg-[oklch(0.65_0.2_145/0.1)] flex items-center justify-center mb-4">
                        <Clock className="w-6 h-6 text-[oklch(0.65_0.2_145)]" />
                      </div>
                      <h3 className="font-semibold mb-1">96%</h3>
                      <p className="text-sm text-muted-foreground">Attendance Rate</p>
                    </div>
                    <div className="bg-card rounded-xl p-6 shadow-sm border">
                      <div className="w-12 h-12 rounded-lg bg-[oklch(0.75_0.15_80/0.1)] flex items-center justify-center mb-4">
                        <Calendar className="w-6 h-6 text-[oklch(0.65_0.15_80)]" />
                      </div>
                      <h3 className="font-semibold mb-1">12</h3>
                      <p className="text-sm text-muted-foreground">Pending Leaves</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
                Everything you need to manage your workforce
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools designed to simplify HR operations and boost productivity
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Employee Management",
                  description: "Centralized employee profiles with personal details, job information, and document management.",
                  color: "oklch(0.55 0.22 260)"
                },
                {
                  icon: Clock,
                  title: "Attendance Tracking",
                  description: "Real-time check-in/check-out system with daily and weekly attendance views.",
                  color: "oklch(0.65 0.2 145)"
                },
                {
                  icon: Calendar,
                  title: "Leave Management",
                  description: "Streamlined leave requests with approval workflows for paid, sick, and unpaid leave.",
                  color: "oklch(0.65 0.15 80)"
                },
                {
                  icon: DollarSign,
                  title: "Payroll Visibility",
                  description: "Clear salary structures with allowances, deductions, and payment tracking.",
                  color: "oklch(0.6 0.2 330)"
                },
                {
                  icon: Shield,
                  title: "Role-Based Access",
                  description: "Secure access control with distinct permissions for employees, HR, and admins.",
                  color: "oklch(0.55 0.18 200)"
                },
                {
                  icon: BarChart3,
                  title: "Analytics Dashboard",
                  description: "Insightful reports and metrics to help you make data-driven decisions.",
                  color: "oklch(0.6 0.2 280)"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="group p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color} / 0.1` }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-20 px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Built for modern HR teams
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Dayflow is designed to digitize and streamline core HR operations. From employee onboarding 
                  to payroll visibility, we provide the tools you need to manage your workforce efficiently.
                </p>
                <ul className="space-y-4">
                  {[
                    "Intuitive interface for all user levels",
                    "Secure authentication and data protection",
                    "Real-time updates and notifications",
                    "Scalable for teams of any size"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 gradient-bg rounded-3xl blur-3xl opacity-20" />
                <div className="relative bg-card rounded-2xl border p-8 shadow-xl">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-semibold">
                        JD
                      </div>
                      <div>
                        <h4 className="font-semibold">John Doe</h4>
                        <p className="text-sm text-muted-foreground">HR Manager</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">
                      &ldquo;Dayflow has transformed how we manage our team. The intuitive interface 
                      and powerful features have saved us countless hours every week.&rdquo;
                    </p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
              Ready to streamline your HR?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join thousands of companies using Dayflow to manage their workforce effectively.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="gradient-bg border-0 h-14 px-10 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-bold text-xl" style={{ fontFamily: 'Sora, sans-serif' }}>Dayflow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Dayflow HRMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
