import { useState } from 'react';
import { Upload, FileText, X, Loader2, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';

const ResumeUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const { user, session, refreshUser } = useUser();

  const handleFileUpload = async (file: File) => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload your resume",
        variant: "destructive"
      });
      return;
    }

    // Validate file type and size
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/resume.${fileExt}`;

      // Delete existing resume if any
      if (user.resume_url) {
        try {
          const resumePath = user.resume_url.includes('resumes/') 
            ? user.resume_url.split('resumes/')[1] 
            : `${user.id}/resume.${fileExt}`;
          await supabase.storage.from('resumes').remove([resumePath]);
        } catch (deleteError) {
          console.log('Old resume deletion failed, continuing with upload:', deleteError);
        }
      }

      // Upload new resume
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get the full public URL for the resume
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(data.path);

      // Update user profile with resume URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ resume_url: urlData.publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      // Refresh user data to get the updated resume_url
      await refreshUser(session);

      toast({
        title: "Resume uploaded successfully",
        description: "Your resume has been uploaded and is now available to employers"
      });
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDeleteResume = async () => {
    if (!user?.id || !user.resume_url) return;

    try {
      // Extract the file path from the URL
      const resumePath = user.resume_url.includes('resumes/') 
        ? user.resume_url.split('resumes/')[1] 
        : `${user.id}/resume.pdf`;
        
      await supabase.storage.from('resumes').remove([resumePath]);

      // Update user profile
      const { error } = await supabase
        .from('users')
        .update({ resume_url: null })
        .eq('id', user.id);

      if (error) throw error;

      await refreshUser(session);

      toast({
        title: "Resume removed",
        description: "Your resume has been successfully removed"
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Error",
        description: "Failed to remove resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume
        </CardTitle>
      </CardHeader>
      <CardContent>
        {user?.resume_url ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium">Resume uploaded</p>
                  <p className="text-sm text-muted-foreground">Ready for employers to view</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(user.resume_url, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteResume}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
          >
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-2">Upload your resume</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your resume to make it available to employers when you apply for jobs
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOC, DOCX (max 5MB)
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                <Button
                  disabled={uploading}
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </>
                  )}
                </Button>
                <span className="text-sm text-muted-foreground">or drag and drop here</span>
              </div>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;