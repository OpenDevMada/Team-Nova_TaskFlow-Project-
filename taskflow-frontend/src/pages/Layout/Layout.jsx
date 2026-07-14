import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import Footer from "./Footer"
import Header from "./Header"
import { Sidebar } from "./Sidebar"

const Layout = ({ children }) => {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
