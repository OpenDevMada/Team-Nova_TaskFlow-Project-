import { Routes, Route } from "react-router-dom"
import Layout from "../Layout/Layout"
import Dashboard from "../Dashboard"

const Index = () => {
  return (
    <Layout userRole="admin">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Layout>
  )
}

export default Index
