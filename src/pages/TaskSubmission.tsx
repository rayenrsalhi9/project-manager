import { useState, useRef, useActionState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Link, useParams, redirect } from "react-router-dom";
import { supabase } from '@/supabase';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, FileText, Image, File, X, CheckCircle2, Loader2 } from "lucide-react";

type UploadedFile = {
  name: string;
  type: string;
  size: number;
  file: File;
}

type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
} | null;

const TaskSubmission = () => {

  // dynamic data
  const {notificationId} = useParams()
  if (!notificationId) throw new Error('No task available')

  const {user, notifications, isLoading, isAuthLoading} = useAuth()
  
  // Loading state handling
  if (isLoading || isAuthLoading || !user || !notifications) {
    return (
      <section className="min-h-[100dvh] flex items-center justify-center py-4 bg-gradient-to-br from-background to-muted/30">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-muted-foreground">Loading task submission...</p>
        </div>
      </section>
    )
  }

  if (!user) throw new Error('No user available')
  if (!notifications) throw new Error('No notifications available')

  const userId = user?.id
  const notification = notifications.find(n => n.id === parseInt(notificationId))
  if (!notification) throw new Error('No notification available')
  const {project_id: projectId} = notification

  // local states
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const ALLOWED_FILE_TYPES = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt']
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    }
    if (type === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
      return 'Invalid file type. Please upload only images (.png, .jpg, .jpeg), documents (.pdf, .docx), or text files (.txt).';
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit.';
    }
    
    return null;
  };

  const handleFileUpload = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploadedFile({
      name: file.name,
      type: file.type,
      size: file.size,
      file: file
    });
    setError('');
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  async function submitTaskAction(_prevState: FormState, formData: FormData): Promise<FormState> {
    try {
      const description = formData.get('description') as string;
      const file = formData.get('file') as File;
      
      // Validate required fields
      if (!description || description.trim().length < 10) {
        return {
          success: false,
          message: 'Please provide a description of at least 10 characters.',
          errors: { description: 'Description must be at least 10 characters long.' }
        };
      }
      
      if (!file || file.size === 0) {
        return {
          success: false,
          message: 'Please upload a file to submit your task.',
          errors: { file: 'File is required for task submission.' }
        };
      }
      
      const filePath = `submissions/${Date.now()}_${file.name}`

      const {error} = await supabase
        .storage
        .from('submissions')
        .upload(filePath, file)

      if(error) return {
        success: false,
          message: 'File upload failed. Please try again.',
          errors: { file: error.message }
      }

      // get the inserted file's public URL
      const {data:fileData} = supabase
        .storage
        .from('submissions')
        .getPublicUrl(filePath)

      const fileURL = fileData.publicUrl

      const submissionObj = {
        description: description.trim(),
        file_name: file.name,
        file_size: file.size,
        file_url: fileURL,
        file_type: file.type,
        project_id: projectId,
        user_id: userId,
        task_id: notificationId
      }

      const {error: submissionInsertError} = await supabase
        .from('task_submissions')
        .insert(submissionObj)

      if (submissionInsertError) return {
        success: false,
        message: 'Submission failed, please try again',
        errors: { file: submissionInsertError.message }
      }

      // Update notification status to submitted
      const {error: updateError} = await supabase
        .from('tasks')
        .update({ is_submitted: true })
        .eq('id', Number(notificationId))

      if (updateError) return {
        success: false,
        message: 'Submission failed, please try again',
        errors: { file: updateError.message }
      }

      toast.success('Task submitted successfully!', {
        style: {
          background: '#f9fafb',
          border: '1px solid #d1d5db',
          color: '#1f2937'
        }
      })

      // redirect to submissions page
      return {
        success: true,
        message: 'Task submitted successfully!',
      };
      
    } catch (error) {
      console.error('Task submission error:', error);
      return {
        success: false,
        message: 'An error occurred while submitting your task. Please try again.',
        errors: { general: 'Submission failed. Please try again.' }
      };
    }
  }

  const [formState, formAction, isPending] = useActionState(submitTaskAction, null);

  return (
    <section className="min-h-[100dvh] flex items-center justify-center py-4 bg-gradient-to-br from-background to-muted/30">
      <div className="w-full max-w-2xl px-4">
        {/* Back Navigation */}
        <Link to='..' relative="path" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:gap-3 group mb-6">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-.5" />
          <span className="text-sm font-medium">
            Back to notification details
          </span>
        </Link>

        {/* Main Task Submission Card */}
        <form action={formAction}>
          <Card className="w-full border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="py-4">
              <CardTitle className="text-xl font-bold text-foreground">
                Task Submission
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Upload the file that proves you completed the task and add a short description of what you did. Once everything looks good, hit “Submit Task” to send it for review.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Form State Messages */}
              {formState && (
                <div className={`p-4 rounded-lg border ${
                  formState.success 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-destructive/10 border-destructive/20 text-destructive'
                }`}>
                  <p className="text-sm font-medium">{formState.message}</p>
                  {formState.errors && Object.keys(formState.errors).length > 0 && (
                    <ul className="mt-2 text-sm space-y-1">
                      {Object.values(formState.errors).map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Task Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Task Description
                </Label>
                <Textarea 
                  id="description"
                  name="description"
                  placeholder="Describe your task completion..."
                  className={`min-h-[100px] resize-none ${
                    formState?.errors?.description ? 'border-destructive' : ''
                  }`}
                  disabled={isPending}
                />
                {formState?.errors?.description && (
                  <p className="text-sm text-destructive">{formState.errors.description}</p>
                )}
              </div>

              {/* File Upload Section */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Upload File
                </Label>
                
                {/* Hidden file input */}
                <Input
                  ref={fileInputRef}
                  type="file"
                  name="file"
                  onChange={handleFileInputChange}
                  accept=".png,.jpg,.jpeg,.pdf,.docx,.txt"
                  className="hidden"
                  disabled={isPending}
                />

                {/* File Selection Area */}
                {!uploadedFile && (
                  <div className="relative border-2 border-dashed rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-3 bg-muted rounded-full">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          <button
                            type="button"
                            onClick={triggerFileInput}
                            className="cursor-pointer text-primary hover:text-primary/80 underline font-medium"
                            disabled={isPending}
                          >
                            Browse files
                          </button>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Accepted: PNG, JPG, JPEG, PDF, DOCX, TXT (Max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {/* Form File Validation Error */}
                {formState?.errors?.file && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <p className="text-sm text-destructive">{formState.errors.file}</p>
                  </div>
                )}

                {/* Uploaded File Display */}
                {uploadedFile && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getFileIcon(uploadedFile.type)}
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(uploadedFile.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        disabled={isPending}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <p className="text-sm text-green-800">File uploaded successfully!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit"
                  className="min-w-[120px]"
                  disabled={isPending || !uploadedFile}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Task'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </section>
  );
};

export default TaskSubmission;