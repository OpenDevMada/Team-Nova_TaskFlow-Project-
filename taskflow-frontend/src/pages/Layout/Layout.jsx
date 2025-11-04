import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import Footer from "./Footer"
import Header from "./Header"
import Sidebar from "./Sidebar"

const Layout = ({ children, userRole }) => {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false) // Par défaut ouvert

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        userRole={user?.role}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout