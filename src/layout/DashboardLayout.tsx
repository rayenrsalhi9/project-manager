import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"

export default function DashboardLayout() {
  return (
    <section className="min-h-dvh">
        <Navbar />
        <Outlet />
        <Toaster />
    </section>
  )
}