import { useState, useMemo } from "react"
import { useOutletContext, Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { FileText, Calendar, User, Filter } from "lucide-react"

type Submission = {
  id: bigint
  created_at: string
  project_id: number
  task_id: number
  user_id: string
  file_url: string
  file_name: string
  file_size: number
  file_type: string
  description: string | null
  status: 'under_review' | 'approved' | 'rejected'
  role: string
  full_name: string
}

type ProjectContext = {
  submissions: Submission[] | null
}

const Submissions = () => {
  const { submissions } = useOutletContext<ProjectContext>()
  const [statusFilter, setStatusFilter] = useState<'all' | 'under_review' | 'approved' | 'rejected'>('all')

  const filteredSubmissions = useMemo(() => {
    if (!submissions) return []
    if (statusFilter === 'all') return submissions
    return submissions.filter(submission => submission.status === statusFilter)
  }, [submissions, statusFilter])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'under_review':
        return 'secondary'
      case 'approved':
        return 'default'
      case 'rejected':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under_review':
        return 'bg-yellow-500'
      case 'approved':
        return 'bg-green-500'
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'under_review':
        return 'Under Review'
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      default:
        return status
    }
  }



  if (!submissions) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading submissions...</p>
        </div>
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No submissions yet</p>
          <p className="text-sm text-gray-400 mt-2">Submissions will appear here when team members submit their work.</p>
        </div>
      </div>
    )
  }

  return (
    <section className="w-full max-w-3xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Task Submissions</h2>
          <p className="text-muted-foreground">
            Review and manage project submissions from team members
          </p>
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['all', 'under_review', 'approved', 'rejected'] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'All' : getStatusText(status)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-2">
        {filteredSubmissions.map((submission) => (
            <Link to={`./${submission.id}`}>
                <Card key={submission.id.toString()} className="hover:shadow-sm transition-shadow p-4">
                    <div className="flex items-center justify-between gap-4">
                    {/* Left side - File Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {submission.file_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {submission.file_type.toUpperCase()} • {formatFileSize(Number(submission.file_size))}
                        </p>
                        </div>
                    </div>

                    {/* Middle - Submitter Info */}
                    <div className="hidden md:flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="font-medium">{submission.full_name}</span>
                        <span className="text-gray-400 dark:text-gray-600">•</span>
                        <span className="text-gray-500 dark:text-gray-400">{submission.role}</span>
                    </div>

                    {/* Middle - Time */}
                    <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span>{format(new Date(submission.created_at), 'MMM dd, yyyy')}</span>
                    </div>

                    {/* Right side - Status and Action */}
                    <div className="flex items-center gap-3">
                        <Badge 
                        variant={getStatusBadgeVariant(submission.status)}
                        className="flex-shrink-0"
                        >
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(submission.status)} mr-1`}></span>
                        {getStatusText(submission.status)}
                        </Badge>
                        <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 px-3"
                        onClick={() => window.open(submission.file_url, '_blank')}
                        >
                        View
                        </Button>
                    </div>
                    </div>

                    {/* Mobile-only submitter info */}
                    <div className="md:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span className="font-medium">{submission.full_name}</span>
                    <span className="text-gray-400 dark:text-gray-600">•</span>
                    <span className="text-gray-500 dark:text-gray-400">{submission.role}</span>
                    <span className="text-gray-400 dark:text-gray-500 ml-auto">{format(new Date(submission.created_at), 'MMM dd')}</span>
                    </div>
                </Card>
            </Link>
        ))}
      </div>

      {/* Empty State for Filtered Results */}
      {filteredSubmissions.length === 0 && submissions.length > 0 && (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">No submissions match the selected filter</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default Submissions