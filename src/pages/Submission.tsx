import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, FileText, User, Calendar, Download, CheckCircle, XCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface Submission {
  id: string | number
  created_at: string
  project_id: string
  task_id: string
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

// Mock data for demonstration - in real app this would come from API
const mockSubmission: Submission = {
  id: '1',
  created_at: '2024-01-15T10:30:00Z',
  project_id: 'proj-123',
  task_id: 'task-456',
  user_id: 'user-789',
  file_url: 'https://example.com/submission.pdf',
  file_name: 'project_proposal.pdf',
  file_size: 2048576, // 2MB
  file_type: 'application/pdf',
  description: 'This is my initial project proposal with detailed requirements and timeline. Please review and provide feedback.',
  status: 'under_review',
  role: 'Developer',
  full_name: 'John Doe'
}

const Submission = () => {

  const [submission, setSubmission] = useState<Submission>(mockSubmission)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get status badge variant
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'under_review':
        return <Clock className="w-4 h-4" />
      case 'approved':
        return <CheckCircle className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  // Get status text
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

  // Handle approval
  const handleApprove = async () => {
    setIsApproving(true)
    // Simulate API call
    setTimeout(() => {
      setSubmission(prev => ({ ...prev, status: 'approved' as const }))
      setIsApproving(false)
    }, 1000)
  }

  // Handle rejection
  const handleReject = async () => {
    setIsRejecting(true)
    // Simulate API call
    setTimeout(() => {
      setSubmission(prev => ({ ...prev, status: 'rejected' as const }))
      setIsRejecting(false)
    }, 1000)
  }

  // Handle file download
  const handleDownload = () => {
    window.open(submission.file_url, '_blank')
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-2">
        <Link 
          to='..'
          relative='path'
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to submissions list
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submission Details</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage this submission
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(submission.status)} className="text-lg px-3 py-1">
          {getStatusIcon(submission.status)}
          <span className="ml-2">{getStatusText(submission.status)}</span>
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* File Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                File Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{submission.file_name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {submission.file_type.toUpperCase()} • {formatFileSize(Number(submission.file_size))}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Description</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {submission.description || 'No description provided.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submission Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Submission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Submission ID</p>
                  <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">{submission.id}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Task ID</p>
                  <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">{submission.task_id}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted</p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {format(new Date(submission.created_at), 'PPP at p')}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">File Type</p>
                  <p className="text-gray-900 dark:text-gray-100">{submission.file_type}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Submitter Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Submitter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {submission.full_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{submission.full_name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{submission.role}</p>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">User ID</span>
                  <span className="text-gray-900 dark:text-gray-100 font-mono">{submission.user_id}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {submission.status === 'under_review' && (
            <Card>
              <CardHeader>
                <CardTitle>Review Actions</CardTitle>
                <CardDescription>
                  Accept or reject this submission
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full flex items-center gap-2" 
                  onClick={handleApprove}
                  disabled={isApproving}
                >
                  <CheckCircle className="w-4 h-4" />
                  {isApproving ? 'Approving...' : 'Approve Submission'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  onClick={handleReject}
                  disabled={isRejecting}
                >
                  <XCircle className="w-4 h-4" />
                  {isRejecting ? 'Rejecting...' : 'Reject Submission'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Status History */}
          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Submitted</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(submission.created_at), 'PP')}
                    </p>
                  </div>
                </div>
                {submission.status !== 'under_review' && (
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      submission.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {submission.status === 'approved' ? 'Approved' : 'Rejected'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Just now</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Submission