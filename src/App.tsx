import { RouterProvider } from "react-router-dom"
import {router} from './router'
import { AuthContextProvider } from "./context/AuthContext"

export default function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  )
}
