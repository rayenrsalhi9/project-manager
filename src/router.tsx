import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";

import ProjectLayout from "./layout/ProjectLayout";
import Timeline from "./pages/project/Timeline";
import Members from "./pages/project/Members";
import TasksProtected from "./components/TasksProtected";
import ProjectInfo from "./pages/project/ProjectInfo";

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
        path: '/profile',
        element: <Profile />,
        errorElement: <ErrorBoundary />
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
            }, {
                path: 'projects/:projectId',
                element: <ProjectLayout />,
                children: [
                    {
                        index: true,
                        element: <Timeline />
                    }, {
                        path: 'members',
                        element: <Members />
                    }, {
                        path: 'info',
                        element: <ProjectInfo />
                    }, {
                        path: 'tasks',
                        element: <TasksProtected />
                    }
                ]
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])