import { useState, useRef } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, FileText, Image, File, X, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

type UploadedFile = {
  name: string;
  type: string;
  size: number;
  file: File;
}

const TaskSubmission = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
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
            {/* Task Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Task Description
              </Label>
              <Textarea 
                id="description"
                placeholder="Describe your task completion..."
                className="min-h-[100px] resize-none"
              />
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
                onChange={handleFileInputChange}
                accept=".png,.jpg,.jpeg,.pdf,.docx,.txt"
                className="hidden"
              />

              {/* Drag and Drop Area */}
              {!uploadedFile && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-3 bg-muted rounded-full">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        Drag and drop your file here, or{' '}
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="text-primary hover:text-primary/80 underline font-medium"
                        >
                          browse
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
                disabled={!uploadedFile}
              >
                Submit Task
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TaskSubmission;