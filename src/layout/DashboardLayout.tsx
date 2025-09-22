import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"

export default function DashboardLayout() {
  return (
    <section className="max-w-4xl mx-auto px-4">
        <Navbar />
        <Outlet />
        <Toaster />
    </section>
  )
}