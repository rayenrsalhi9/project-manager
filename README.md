# ProjectRoom - Team Collaboration Platform

A modern React-based project management platform built for teams, students, and startups to organize projects, track tasks, and collaborate effectively. ProjectRoom provides a comprehensive suite of tools for project management, team collaboration, and progress tracking.

## 🚀 Technical Stack

**Frontend Framework:**
• React 19.1.1 with TypeScript for type-safe development
• Vite 7.1.6 for fast development and optimized builds
• React Router DOM 7.9.1 for client-side routing

**UI/UX:**
• Tailwind CSS 4.1.13 for utility-first styling
• shadcn/ui components for consistent design system
• Radix UI primitives for accessible components (Avatar, Dialog, Dropdown, Label, Popover, ScrollArea, Select, Slot)
• Lucide React 0.544.0 for consistent iconography
• next-themes 0.4.6 for theme management (light/dark modes)
• React Day Picker 9.11.0 for date selection components
• Sonner 2.0.7 for toast notifications
• Recharts 3.2.1 for data visualization and charts

**Backend Integration:**
• Supabase 2.57.4 for authentication, database, and real-time subscriptions
• OpenAI API integration (v6.1.0) for AI-powered task generation
• Environment-based configuration for secure API keys

**Development Tools:**
• TypeScript with strict mode and path aliases (@/)
• ESLint with React-specific configurations
• DnD Kit (@dnd-kit) for drag-and-drop functionality (Core, Sortable, Utilities)
• date-fns 4.1.0 for date manipulation and formatting
• DOMPurify 3.2.7 for XSS protection and input sanitization
• class-variance-authority 0.7.1 and tailwind-merge 3.3.1 for component styling

## 📋 Features

### Authentication & User Management
• **User Registration**: Complete signup with full name, email, and password validation
• **Secure Login**: Email/password authentication with session management
• **Protected Routes**: Route-level authentication protection
• **User Profiles**: Personalized user profiles with role-based access
• **Session Management**: Automatic token handling and persistent sessions

### Project Management
• **Create Projects**: Users can create new projects with names, descriptions, and auto-generated invite codes
• **Join Projects**: Join existing projects using secure invite codes
• **Project Dashboard**: Visual grid layout showing all user projects with filtering options
• **Role-Based Access**: Admin and collaborator roles with visual indicators
• **Project Timeline**: Activity feed showing project updates and member activities
• **Project Settings**: Manage project details and team membership

### 🎯 Task Management
• **AI-Powered Task Generation**: Generate tasks from project descriptions using OpenAI
• **Drag-and-Drop Interface**: Intuitive task assignment with visual feedback using DnD Kit
• **Task Assignment**: Assign tasks to team members with status tracking
• **Task Timeline**: Track task creation, updates, and completion
• **Task Filtering**: Filter tasks by status, assignee, or deadline urgency (all, overdue, due today)
• **Role-Based Task Access**: Admins can create and assign tasks, members have read-only access
• **Task Status Tracking**: Visual indicators for finished vs in-progress tasks (To Do, In Progress, Completed, Overdue)
• **Deadline Management**: Color-coded urgency indicators and overdue task highlighting
• **Statistics Dashboard**: Real-time task completion rates and progress visualization

### Team Collaboration
• **Member Management**: Add/remove team members and manage roles
• **Real-time Updates**: Live project timeline with member activities
• **Progress Tracking**: Visual progress indicators and status updates
• **Notification System**: Comprehensive task assignment notifications with deadline tracking
• **Task Submission Workflow**: Structured notification-to-submission process for assigned tasks

### 🔔 Notification System
• **Task Assignment Notifications**: Automatic notifications when tasks are assigned
• **Deadline Reminders**: Urgency-based notifications for approaching deadlines
• **Notification Center**: Centralized view of all notifications with detailed information
• **Status Tracking**: Notifications include task details, deadlines, and project context
• **Direct Links**: Quick navigation from notifications to task submission forms

### 📤 Task Submission Workflow
• **Structured Process**: Notification → Task Details → Submission Form workflow
• **Current Implementation**: Basic form structure with task information display
• **Under Development**: File upload, rich text editor, validation, and progress tracking
• **Next Steps**: Comprehensive submission system with admin review capabilities

### User Interface
• **Responsive Design**: Mobile-first, fully responsive interface
• **Modern UI Components**: Consistent design system with shadcn/ui
• **Loading States**: Skeleton loaders and spinners for better UX
• **Error Handling**: Graceful error boundaries and user-friendly messages
• **Theme Support**: Light and dark mode with system preference detection

### Security Features
• **Input Sanitization**: DOMPurify integration for XSS protection
• **Form Validation**: Comprehensive validation with custom rules
• **Environment Variables**: Secure configuration management
• **TypeScript**: Type-safe development with strict mode

## 🛠️ Installation

### Prerequisites
• Node.js (v18 or higher)
• npm or yarn package manager
• Git for version control

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd my-project
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the root directory with the following variables:

```env
# Required Environment Variables
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_API_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_BASE_URL=your_openai_base_url

# Optional: File Upload Configuration
VITE_MAX_FILE_SIZE=10485760  # 10MB in bytes
VITE_ALLOWED_FILE_TYPES=pdf,doc,docx,png,jpg,jpeg

# Optional: Notification Settings
VITE_NOTIFICATION_REFRESH_INTERVAL=30000  # 30 seconds in milliseconds
```

4. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/            # shadcn/ui base components (Button, Card, Dialog, etc.)
│   ├── dialogs/       # Modal dialogs
│   │   ├── CreateProjectDialog.tsx
│   │   ├── JoinProjectDialog.tsx
│   │   └── GenerateTasksDialog.tsx
│   ├── charts/        # Data visualization components
│   ├── Navbar.tsx     # Navigation component with theme toggle
│   ├── Protected.tsx  # Authentication wrapper
│   ├── TasksProtected.tsx # Role-based task access control
│   ├── ErrorBoundary.tsx # Error handling
│   ├── EmptyState.tsx # Empty state UI
│   ├── Spinner.tsx    # Loading indicators
│   ├── SuspenseWrapper.tsx # Lazy loading wrapper
│   └── ...
├── pages/             # Route components
│   ├── Home.tsx       # Landing page
│   ├── About.tsx      # About page
│   ├── Signin.tsx     # Login page
│   ├── Signup.tsx     # Registration page
│   ├── Dashboard.tsx  # User dashboard with project grid
│   ├── Profile.tsx    # User profile management
│   ├── Notification.tsx # Individual notification details
│   ├── Notifications.tsx # All notifications list
│   ├── TaskSubmission.tsx # Task submission form (under development)
│   └── project/       # Project-specific pages
│       ├── Timeline.tsx    # Project activity feed
│       ├── Members.tsx     # Team management
│       ├── ProjectInfo.tsx # Project details
│       ├── Progress.tsx    # Progress tracking with charts
│       ├── Tasks.tsx       # Admin task management
│       ├── TasksReadOnly.tsx # Member task view
│       ├── progress/       # Progress subcomponents
│       │   ├── BarChart.tsx
│       │   ├── Pie.tsx
│       │   ├── Stats.tsx
│       │   └── types.ts
│       └── tasks/          # Task management subcomponents
│           ├── AssignmentStep.tsx
│           ├── CreateTasksStep.tsx
│           ├── SortableTaskItem.tsx
│           ├── types.ts
│           └── utils.ts
├── context/           # React contexts
│   ├── AuthContext.tsx    # Authentication state and notifications
│   └── ThemeContext.tsx   # Theme management
├── layout/            # Layout components
│   ├── DashboardLayout.tsx # Dashboard wrapper
│   └── ProjectLayout.tsx   # Project wrapper with data fetching
├── hooks/             # Custom React hooks
│   └── useTimeline.ts # Timeline data fetching
├── services/          # External service integrations
│   └── aiService.ts # OpenAI API integration
├── lib/               # Utility libraries
│   └── utils.ts     # Helper functions
└── utils.ts         # Application utilities (validation, formatting, etc.)
```

## 🔧 Configuration

### TypeScript Configuration
• Strict mode enabled for type safety
• Path aliases configured (`@/` maps to `./src/`)
• Separate configurations for app and node environments

### Vite Configuration
• React plugin with fast refresh
• Tailwind CSS integration
• Path resolution for clean imports
• Optimized build process

### Tailwind CSS Configuration
• Utility-first CSS framework
• Custom color schemes and themes
• Responsive design utilities
• Component-specific styling

## 🎯 Usage Examples

### Creating a New Project
1. Navigate to the dashboard after logging in
2. Click "Create Project" button
3. Fill in project name and description
4. Project will be created with auto-generated invite code

### Joining an Existing Project
1. Click "Join Project" button on dashboard
2. Enter the invite code provided by project admin
3. You'll be added as a collaborator

### Generating Tasks with AI
1. Navigate to a project
2. Click "Generate Tasks" button
3. Enter project description
4. AI will generate relevant tasks for your project

### Managing Team Members
1. Go to project settings
2. Navigate to "Members" tab
3. View current members and their roles
4. Use invite codes to add new members

## 🔒 Environment Variables

The application requires the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_SUPABASE_URL | Supabase project URL | Yes |
| VITE_SUPABASE_API_KEY | Supabase anon key | Yes |
| VITE_OPENAI_API_KEY | OpenAI API key | Yes |
| VITE_BASE_URL | OpenAI base URL | Yes |

## 📝 Task Submission Workflow

### Current Implementation
The task submission system provides a structured workflow for team members to complete assigned tasks:

1. **Notification Receipt**: Users receive task assignment notifications with details including:
   - Task title and description
   - Project context
   - Assigned by information
   - Deadline with urgency indicators (color-coded)
   - Creation timestamp

2. **Notification Details**: Users can view comprehensive task information with:
   - Visual deadline urgency indicators (red/orange/yellow/green)
   - Project and admin context
   - Direct navigation to submission form

3. **Submission Process**: Users proceed to task submission via dedicated route

### Next Steps for Task Submission Implementation

#### User Submission Workflow
- **File Upload System**: Implement drag-and-drop file upload with multiple format support
- **Submission Form**: Create comprehensive form with:
  - Task completion description
  - File attachments (documents, images, code files)
  - Completion confirmation checkbox
  - Optional notes/comments field
- **Validation**: Implement client-side validation for required fields
- **Progress Indicators**: Add upload progress bars and form validation states

#### Admin Review Process
- **Submission Dashboard**: Admin interface to review all pending submissions
- **Review Criteria**:
  - Task completion verification against original requirements
  - File/document quality assessment
  - Deadline compliance checking
  - Optional feedback/comment system
- **Decision Actions**:
  - **Accept**: Mark task as completed, update project progress
  - **Reject**: Return task with feedback, reset to in_progress status
  - **Request Changes**: Partial approval with modification requests

#### Status Transitions
- **Successful Submission Flow**:
  1. User submits completed task
  2. Admin receives notification of new submission
  3. Admin reviews and accepts/rejects
  4. Task status updates to "finished" or remains "in_progress"
  5. Project progress recalculates automatically

- **Rejection Scenarios**:
  - **Incomplete Work**: Missing required deliverables
  - **Quality Issues**: Substandard work quality
  - **Deadline Issues**: Late submissions requiring special handling
  - **Technical Issues**: File corruption or format problems

- **Automatic Status Updates**:
  - Tasks marked as "finished" upon admin acceptance
  - Tasks remain "in_progress" if rejected or requiring changes
  - Deadline extensions handled through admin interface
  - Progress metrics update in real-time
## 🧪 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production with TypeScript compilation |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run preview` | Preview production build locally |

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices and maintain type safety
2. Use the established component patterns and design system
3. Write clear, descriptive commit messages
4. Test your changes across different screen sizes
5. Ensure all form inputs are properly validated and sanitized

### Code Style
• Use TypeScript strict mode
• Follow the established component structure
• Maintain consistent naming conventions
• Use the provided utility functions for common operations
• Implement proper error handling

### Pull Request Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request with detailed description

## 🚀 Next Steps: Task Submission Implementation

### Current Status
The task submission system is partially implemented with:
- ✅ Notification system for task assignments
- ✅ Task details view with deadline tracking
- ⚠️ Basic submission form structure (under development)
- ❌ File upload functionality
- ❌ Admin review workflow

### Implementation Plan

#### 1. User Submission Workflow
**Phase 1: Core Submission Features**
- **File Upload System**: Multi-file upload with drag-and-drop support
- **Rich Text Editor**: Description field with formatting options
- **Validation**: Required fields, file type/size validation, deadline checks
- **Progress Indicators**: Upload progress, form validation states
- **Auto-save**: Draft preservation during submission process

**Phase 2: Enhanced User Experience**
- **Submission History**: Track all user submissions with timestamps
- **Resubmission**: Allow updates before deadline
- **Preview Mode**: Review submission before finalizing
- **Confirmation**: Success/error notifications with clear feedback

#### 2. Admin Review Process

**Review Dashboard**
- **Submission Queue**: Filterable list of pending submissions
- **Quick Actions**: Accept/Reject with reason codes
- **Bulk Operations**: Process multiple submissions efficiently
- **Review History**: Track admin decisions and feedback

**Acceptance Criteria**
- **Quality Standards**: Check for completeness and accuracy
- **Deadline Compliance**: Ensure submissions meet deadlines
- **File Validation**: Verify file formats and content
- **Requirements Met**: Confirm all task requirements are addressed

**Rejection Scenarios**
- **Incomplete Submissions**: Missing required elements
- **Late Submissions**: Past deadline submissions
- **Quality Issues**: Poor quality or incorrect content
- **Technical Problems**: File corruption or format issues
- **Resubmission Requests**: Allow users to address feedback

#### 3. Status Transitions

**Task Status Flow**
```
assigned → in_progress → submitted → reviewed → finished
                    ↓           ↓
                overdue    rejected → in_progress (resubmission)
```

**Status Management**
- **Automatic Updates**: Status changes based on deadlines and actions
- **Manual Overrides**: Admins can adjust statuses when needed
- **History Tracking**: Log all status changes with reasons
- **Notifications**: Alert users and admins of status changes

**Completion Logic**
- **Successful Submission**: Task marked as finished after acceptance
- **Rejection Handling**: Task returns to in_progress with feedback
- **Deadline Management**: Automatic overdue status updates
- **Completion Rates**: Track and display project completion statistics

### Technical Implementation
- **Database Schema**: Extend tasks table with submission fields
- **File Storage**: Supabase storage for submission files
- **API Endpoints**: New endpoints for submission and review operations
- **Real-time Updates**: Live status updates using Supabase subscriptions
- **Security**: File upload validation, access control, data sanitization

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/signout` - User logout
- `GET /auth/session` - Get current user session

### Project Endpoints
- `GET /projects` - List user projects
- `POST /projects` - Create new project
- `GET /projects/:id` - Get project details
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `POST /projects/:id/join` - Join project with invite code

### Task Endpoints
- `GET /projects/:id/tasks` - List project tasks
- `POST /projects/:id/tasks` - Create project tasks (AI-powered)
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `POST /tasks/:id/assign` - Assign task to member

### Notification Endpoints
- `GET /notifications` - Get user notifications
- `GET /notifications/:id` - Get notification details
- `PUT /notifications/:id/read` - Mark notification as read
- `DELETE /notifications/:id` - Delete notification

### Task Submission Endpoints (Planned)
- `POST /tasks/:id/submissions` - Submit task completion
- `GET /tasks/:id/submissions` - Get task submissions
- `PUT /submissions/:id` - Update submission
- `DELETE /submissions/:id` - Delete submission
- `POST /submissions/:id/review` - Review submission (accept/reject)
- `GET /submissions/review-queue` - Get pending review submissions

### Supabase Integration
The application uses Supabase for:
• User authentication and session management
• Project and task data storage
• Real-time subscriptions for live updates
• User profile management

### OpenAI Integration
AI-powered features include:
• Task generation from project descriptions
• Natural language processing for project planning
• Automated task suggestions based on project context

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
• Ensure all dependencies are installed: `npm install`
• Check TypeScript configuration files
• Verify environment variables are properly set

**Authentication Issues**
• Verify Supabase credentials in environment variables
• Check network connectivity to Supabase
• Ensure user has proper permissions

**AI Service Issues**
• Verify OpenAI API key is valid
• Check API rate limits and usage
• Ensure base URL is correctly configured

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

• Built with modern React ecosystem tools
• UI components powered by shadcn/ui and Radix UI
• Icons from Lucide React
• Styling with Tailwind CSS
• Backend services powered by Supabase
• AI capabilities powered by OpenAI