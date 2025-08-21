import { CollapsibleSidebar } from '@/components/layout/collapsible-sidebar'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background relative">
      {/* Desktop Collapsible Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 relative z-40">
        <CollapsibleSidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        {/* Header for mobile */}
        <div className="lg:hidden">
          <Header />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}