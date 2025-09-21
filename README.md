# ProjectRoom - Team Collaboration Platform

A modern React-based project management platform built for teams, students, and startups to organize projects, track tasks, and collaborate effectively.

## 🚀 Technical Stack

**Frontend Framework:**
• React 19.1.1 with TypeScript for type-safe development
• Vite 7.1.6 for fast development and optimized builds
• React Router DOM 7.9.1 for client-side routing

**UI/UX:**
• Tailwind CSS 4.1.13 for utility-first styling
• shadcn/ui components for consistent design system
• Radix UI primitives for accessible components
• Lucide React 0.544.0 for consistent iconography
• next-themes 0.4.6 for theme management

**Backend Integration:**
• Supabase 2.57.4 for authentication and database
• Environment-based configuration for secure API keys

**Development Tools:**
• TypeScript with strict linting rules
• ESLint with React-specific configurations
• Path aliases (@/) for clean imports

## 📋 Features Implemented

**Authentication System:**
• User registration with full name, email, and password
• Secure login with email/password authentication
• Protected routes for authenticated users only
• Session management with automatic token handling
• Sign out functionality with toast notifications

**Project Management:**
• **Create Projects**: Users can create new projects with name and description
• **Join Projects**: Users can join existing projects using secret codes
• **Project Display**: Visual grid layout showing all user projects
• **Role Management**: Admin and collaborator roles with visual indicators
• **Empty State**: Friendly illustration when no projects exist
• **Project Cards**: Interactive cards with hover effects and action buttons

**User Dashboard:**
• Personalized welcome message with user name
• Action buttons for creating and joining projects
• Responsive grid layout for project display
• Admin badges for project owners
• Quick access to open projects

**User Interface:**
• Responsive navigation bar with mobile-friendly hamburger menu
• Modern landing page with hero section and call-to-action
• About page showcasing platform benefits and features
• 404 error page with user-friendly messaging
• Error boundary for graceful error handling
• Loading skeletons for better user experience
• Dialog components for project creation/joining
• Toast notifications for user feedback

**Page Structure:**
• Home page with compelling hero section
• About page highlighting collaboration benefits
• Sign-in page with form validation
• Sign-up page with user registration
• Dashboard for authenticated users with project management
• Protected route system

**Design System:**
• Consistent button variants (default, outline, secondary, ghost, link)
• Card components for content organization
• Sheet components for mobile navigation
• Form components (Input, Label) with proper styling
• Badge components for role indicators
• Responsive grid layouts

**Security & Performance:**
• Form validation utilities for input sanitization
• Environment variable protection for sensitive data
• TypeScript strict mode for code quality
• Component-based architecture for maintainability
• Error handling with user-friendly messages
• Loading states for better UX

## 🛠️ Available Scripts

• `npm run dev` - Start development server
• `npm run build` - Build for production
• `npm run lint` - Run ESLint for code quality
• `npm run preview` - Preview production build

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── dialogs/        # Dialog components
│   │   ├── CreateProjectDialog.tsx  # Project creation dialog
│   │   └── JoinProjectDialog.tsx    # Project joining dialog
│   ├── Navbar.tsx      # Navigation component
│   ├── ErrorBoundary.tsx # Error handling
│   ├── DashboardSkeleton.tsx # Loading skeleton for dashboard
│   ├── EmptyState.tsx  # Empty state illustration
│   └── ...
├── pages/              # Route components
│   ├── Home.tsx        # Landing page
│   ├── About.tsx       # About page
│   ├── Signin.tsx      # Login page
│   ├── Signup.tsx      # Registration page
│   └── Dashboard.tsx   # User dashboard with project management
├── context/            # React contexts
│   └── AuthContext.tsx # Authentication state with project data
├── layout/             # Layout components
│   └── DashboardLayout.tsx # Dashboard wrapper
├── lib/                # Utility functions
└── utils.ts            # Helper functions for project operations
```

## 🔧 Configuration

• TypeScript with strict mode enabled
• Path aliases configured for clean imports
• Tailwind CSS with custom configuration
• Vite with React plugin and path resolution

## 🎯 Next Steps

**Core Features Completed:**
✅ Authentication system with user registration and login
✅ Project creation and management functionality
✅ Project joining system with secret codes
✅ User dashboard with project display
✅ Role-based access (Admin/Collaborator)
✅ Responsive UI with modern design system

**Upcoming Features:**
• **Task Management**: Create, assign, and track project tasks
• **Team Collaboration**: Real-time messaging and file sharing
• **Project Settings**: Edit project details and manage team members
• **Advanced Search**: Filter and search through projects and tasks
• **Analytics Dashboard**: Project progress and team performance metrics
• **Mobile App**: Native mobile application for on-the-go access
• **Integrations**: Connect with popular tools like Slack, GitHub, etc.
