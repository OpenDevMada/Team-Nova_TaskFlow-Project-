import { Routes, Route } from "react-router-dom"
import Layout from "../Layout/Layout"
import AdminDashboard from "@/components/tasks/TaskManager"

const Index = () => {
  return (
    <Layout userRole="admin">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        {/* <Route path="/tasks" element={<Tasks />} />
        <Route path="/projects" element={<Projects />} /> */}
      </Routes>
    </Layout>
  )
}

export default Index
