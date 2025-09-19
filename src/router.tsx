import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";

import Root from "./components/Root";
import Protected from "./components/Protected";

import NotFound from "./components/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/about",
        element: <About />
    },
    {
        path: '/signin',
        element: <Signin />,
        errorElement: <ErrorBoundary />
    },
    {
        path: '/signup',
        element: <Signup />,
        errorElement: <ErrorBoundary />
    },
    {
        path: '/dashboard',
        element: (
            <Protected>
                <DashboardLayout />
            </Protected>
        ),
        errorElement: <ErrorBoundary />,
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