import { useState } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';

const AvatarUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user, session, refreshUser } = useUser();

  const handleFileUpload = async (file: File) => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload your avatar",
        variant: "destructive"
      });
      return;
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WEBP image",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete existing avatar if any
      if (user.avatar_url) {
        try {
          const oldFileName = user.avatar_url.split('/').pop();
          if (oldFileName) {
            await supabase.storage.from('avatars').remove([`${user.id}/${oldFileName}`]);
          }
        } catch (deleteError) {
          console.log('Old avatar deletion failed, continuing with upload:', deleteError);
        }
      }

      // Upload new avatar
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      // Update user profile with avatar URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      // Refresh user data
      await refreshUser(session);

      toast({
        title: "Avatar uploaded successfully",
        description: "Your profile picture has been updated"
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your avatar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user?.id || !user.avatar_url) return;

    try {
      const fileName = user.avatar_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('avatars').remove([`${user.id}/${fileName}`]);
      }

      const { error } = await supabase
        .from('users')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (error) throw error;

      await refreshUser(session);

      toast({
        title: "Avatar removed",
        description: "Your profile picture has been removed"
      });
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast({
        title: "Error",
        description: "Failed to remove avatar. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={user?.avatar_url || ''} alt={user?.name || 'User'} />
          <AvatarFallback className="text-2xl">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        {user?.avatar_url && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
            onClick={handleRemoveAvatar}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => document.getElementById('avatar-upload')?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Change Photo
            </>
          )}
        </Button>
        <input
          id="avatar-upload"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        JPG, PNG or WEBP (max 2MB)
      </p>
    </div>
  );
};

export default AvatarUpload;
