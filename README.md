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
• Radix UI primitives for accessible components
• Lucide React 0.544.0 for consistent iconography
• next-themes 0.4.6 for theme management (light/dark modes)

**Backend Integration:**
• Supabase 2.57.4 for authentication, database, and real-time subscriptions
• OpenAI API integration for AI-powered task generation
• Environment-based configuration for secure API keys

**Development Tools:**
• TypeScript with strict mode and path aliases (@/)
• ESLint with React-specific configurations
• DnD Kit for drag-and-drop functionality
• Sonner for toast notifications

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

### Task Management
• **AI-Powered Task Generation**: Generate tasks from project descriptions using OpenAI
• **Task Assignment**: Assign tasks to team members with status tracking
• **Task Timeline**: Track task creation, updates, and completion
• **Task Filtering**: Filter tasks by status, assignee, or project

### Team Collaboration
• **Member Management**: Add/remove team members and manage roles
• **Real-time Updates**: Live project timeline with member activities
• **Progress Tracking**: Visual progress indicators and status updates
• **Notifications**: System notifications for project activities

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
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_API_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_BASE_URL=your_openai_base_url
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
│   ├── ui/            # shadcn/ui base components
│   ├── dialogs/       # Modal dialogs
│   │   ├── CreateProjectDialog.tsx
│   │   ├── JoinProjectDialog.tsx
│   │   └── GenerateTasksDialog.tsx
│   ├── Navbar.tsx     # Navigation component
│   ├── Protected.tsx  # Authentication wrapper
│   ├── ErrorBoundary.tsx # Error handling
│   └── ...
├── pages/             # Route components
│   ├── Home.tsx       # Landing page
│   ├── About.tsx      # About page
│   ├── Signin.tsx     # Login page
│   ├── Signup.tsx     # Registration page
│   ├── Dashboard.tsx  # User dashboard
│   ├── Profile.tsx    # User profile
│   └── project/       # Project-specific pages
│       ├── Timeline.tsx    # Project activity feed
│       ├── Members.tsx     # Team management
│       ├── ProjectInfo.tsx # Project details
│       └── Progress.tsx    # Progress tracking
├── context/           # React contexts
│   ├── AuthContext.tsx    # Authentication state
│   └── ThemeContext.tsx   # Theme management
├── layout/            # Layout components
│   ├── DashboardLayout.tsx # Dashboard wrapper
│   └── ProjectLayout.tsx   # Project wrapper
├── hooks/             # Custom React hooks
│   └── useTimeline.ts # Timeline data fetching
├── services/          # External service integrations
│   └── aiService.ts # OpenAI API integration
├── lib/               # Utility libraries
│   └── utils.ts     # Helper functions
└── utils.ts         # Application utilities
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

## 📚 API Documentation

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

## 📞 Support

For support and questions:
• Check the troubleshooting section
• Review the documentation
• Open an issue in the repository
• Contact the development team

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
