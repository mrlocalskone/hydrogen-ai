
import React from 'react';
import { Button } from "@/components/ui/button";
import { Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileAttachmentHandlerProps {
  attachedFiles: File[];
  onFileChange: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  isMobile?: boolean;
  className?: string;
}

export const FileAttachmentHandler: React.FC<FileAttachmentHandlerProps> = ({
  attachedFiles,
  onFileChange,
  onRemoveFile,
  isMobile = false,
  className
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileAttachment = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFileChange([...attachedFiles, ...files]);
  };

  return (
    <>
      {/* Animated file attachments preview */}
      {attachedFiles.length > 0 && (
        <div className={cn(
          "flex flex-wrap gap-2 mb-4 animate-fade-in",
          isMobile && "text-sm"
        )}>
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className={cn(
                "group flex items-center gap-2 px-3 py-2 rounded-lg",
                "bg-gradient-to-r from-accent/20 to-accent/10",
                "border border-border/50 hover:border-border",
                "transition-all duration-300 hover:scale-105",
                "hover:shadow-md animate-scale-in"
              )}
            >
              <Paperclip className="w-3 h-3 text-primary animate-bounce" />
              <span className="text-xs font-medium truncate max-w-[120px]">
                {file.name}
              </span>
              <button
                onClick={() => onRemoveFile(index)}
                className={cn(
                  "text-muted-foreground hover:text-destructive",
                  "transition-all duration-200 hover:scale-110",
                  "rounded-full p-0.5 hover:bg-destructive/10"
                )}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced attachment button */}
      <Button
        type="button"
        variant="ghost"
        size={isMobile ? "sm" : "icon"}
        onClick={handleFileAttachment}
        className={cn(
          "relative overflow-hidden group",
          "hover:bg-primary/10 hover:text-primary",
          "transition-all duration-300 hover:scale-110",
          isMobile && "h-8 w-8",
          className
        )}
      >
        {/* Button ripple effect */}
        <div className={cn(
          "absolute inset-0 bg-primary/20 rounded-full",
          "scale-0 group-hover:scale-100 transition-transform duration-300"
        )} />
        
        <Paperclip className={cn(
          "relative z-10 transition-all duration-300",
          "group-hover:rotate-12",
          isMobile ? "w-3.5 h-3.5" : "w-4 h-4"
        )} />
      </Button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.txt,.doc,.docx"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </>
  );
};
