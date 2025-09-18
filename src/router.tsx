import { createBrowserRouter } from "react-router-dom";

import Hero from "./pages/Hero";
import About from "./pages/About";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";

import NotFound from "./components/NotFound";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Hero />
    },
    {
        path: "/about",
        element: <About />
    },
    {
        path: '/signin',
        element: <Signin />
    },
    {
        path: '/signup',
        element: <Signup />
    },
    {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])