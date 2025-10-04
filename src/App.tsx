import { RouterProvider } from "react-router-dom"
import {router} from './router'
import { AuthContextProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import ThemeToggle from "./components/ThemeToggle"

export default function App() {
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
      <ThemeToggle variant="floating" size="md" />
    </ThemeProvider>
  )
}
