import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import SuspenseWrapper from "./components/SuspenseWrapper";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Profile = lazy(() => import("./pages/Profile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Notification = lazy(() => import("./pages/Notification"));
const TaskSubmission = lazy(() => import("./pages/TaskSubmission"));
const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));
const DashboardLayout = lazy(() => import("./layout/DashboardLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectLayout = lazy(() => import("./layout/ProjectLayout"));
const Timeline = lazy(() => import("./pages/project/Timeline"));
const Members = lazy(() => import("./pages/project/Members"));
const TasksProtected = lazy(() => import("./components/TasksProtected"));
const ProjectInfo = lazy(() => import("./pages/project/ProjectInfo"));
const Progress = lazy(() => import("./pages/project/Progress"));
const SubmissionsProtected = lazy(() => import("./components/SubmissionsProtected"))
const Submission = lazy(() => import("./pages/project/Submission"))
const AssignedTask = lazy(() => import("./pages/project/AssignedTask"))
const Root = lazy(() => import("./components/Root"));
const Protected = lazy(() => import("./components/Protected"));
const NotFound = lazy(() => import("./components/NotFound"));
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));

export const router = createBrowserRouter([
    {
        path: "/",
        element: <SuspenseWrapper><Root /></SuspenseWrapper>,
        errorElement: <SuspenseWrapper><ErrorBoundary /></SuspenseWrapper>
    },
    {
        path: "/home",
        element: <SuspenseWrapper><Home /></SuspenseWrapper>,
    },
    {
        path: "/about",
        element: <SuspenseWrapper><About /></SuspenseWrapper>
    },
    {
        path: '/profile',
        element: <SuspenseWrapper><Profile /></SuspenseWrapper>,
        errorElement: <SuspenseWrapper><ErrorBoundary /></SuspenseWrapper>
    },
    {
        path: '/signin',
        element: <SuspenseWrapper><Signin /></SuspenseWrapper>,
        errorElement: <SuspenseWrapper><ErrorBoundary /></SuspenseWrapper>
    },
    {
        path: '/signup',
        element: <SuspenseWrapper><Signup /></SuspenseWrapper>,
        errorElement: <SuspenseWrapper><ErrorBoundary /></SuspenseWrapper>
    },
    {
        path: '/dashboard',
        element: (
            <SuspenseWrapper>
                <Protected>
                    <DashboardLayout />
                </Protected>
            </SuspenseWrapper>
        ),
        errorElement: <SuspenseWrapper><ErrorBoundary /></SuspenseWrapper>,
        children: [
            {
                index: true,
                element: <SuspenseWrapper><Dashboard /></SuspenseWrapper>
            }, {
                path: 'projects/:projectId',
                element: <SuspenseWrapper><ProjectLayout /></SuspenseWrapper>,
                children: [
                    {
                        index: true,
                        element: <SuspenseWrapper><Timeline /></SuspenseWrapper>
                    }, {
                        path: 'members',
                        element: <SuspenseWrapper><Members /></SuspenseWrapper>
                    }, {
                        path: 'info',
                        element: <SuspenseWrapper><ProjectInfo /></SuspenseWrapper>
                    }, {
                        path: 'tasks',
                        element: <SuspenseWrapper><TasksProtected /></SuspenseWrapper>
                    }, {
                        path: 'progress',
                        element: <SuspenseWrapper><Progress /></SuspenseWrapper>
                    }, {
                        path: 'submissions',
                        element: <SuspenseWrapper><SubmissionsProtected /></SuspenseWrapper>
                    }, {
                        path: 'submissions/:submissionId',
                        element: <SuspenseWrapper><Submission /></SuspenseWrapper>
                    }, {
                        path: 'submissions/:submissionId/assignedTask',
                        element: <SuspenseWrapper><AssignedTask /></SuspenseWrapper>
                    }
                ]
            }
        ]
    },
    {
        path: '/notifications',
        element: <SuspenseWrapper><Notifications /></SuspenseWrapper>,
        errorElement: <SuspenseWrapper><ErrorBoundary /></SuspenseWrapper>
    },
    {
        path: '/notifications/:notificationId',
        element: <SuspenseWrapper><Notification /></SuspenseWrapper>,
        errorElement: <SuspenseWrapper><ErrorBoundary /></SuspenseWrapper>,
    },
    {
        path: '/notifications/:notificationId/submit',
        element: <SuspenseWrapper><TaskSubmission /></SuspenseWrapper>,
        errorElement: <SuspenseWrapper><ErrorBoundary /></SuspenseWrapper>
    },
    {
        path: '*',
        element: <SuspenseWrapper><NotFound /></SuspenseWrapper>
    }
])