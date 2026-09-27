import { Outlet } from "react-router-dom"
import { useAdmin } from "./AdminContext"
import AdminLogin from "./AdminLogin"

export default function AdminGuard() {
  const { isAuthenticated } = useAdmin()

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return <Outlet />
}
