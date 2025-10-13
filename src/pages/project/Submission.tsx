import { Link, useOutletContext, useParams } from 'react-router-dom'
import type { ProjectContext } from './Submissions'
import { ArrowLeft, FileText, User, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const Submission = () => {

  const {submissionId} = useParams()
  if(!submissionId) throw new Error('No submission available')

  const { submissions } = useOutletContext<ProjectContext>()
  if (!submissions) throw new Error('No submissions available')

  const submission = submissions.find(s => s.id === parseInt(submissionId))
  if(!submission) throw new Error('No submission available')

  const getInitials = (name: string = 'Anonymous User') => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Format file size
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
          <h1 className="text-2xl font-bold tracking-tight">Submission Details</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage this submission
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(submission.status)} className="text-sm px-3 py-1">
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
                      {submission.file_type} • {formatFileSize(Number(submission.file_size))}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(submission.file_url, '_blank')}
                >
                  View File
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
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted</p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {format(new Date(submission.created_at), 'd MMMM yyyy, h:mm a')}
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
                <Avatar className="w-16 h-16 mx-auto mb-3 border border-border">
                  <AvatarFallback className="text-lg font-semibold bg-muted text-muted-foreground">
                    {getInitials(submission.full_name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{submission.full_name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{submission.role}</p>
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
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Submission
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Submission
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Submission