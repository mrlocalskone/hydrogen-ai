
import React from 'react';
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
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
      {/* File attachments preview */}
      {attachedFiles.length > 0 && (
        <div className={cn(
          "flex flex-wrap gap-2 mb-3",
          isMobile && "text-sm"
        )}>
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-accent/20 px-3 py-1 rounded-lg border border-border"
            >
              <Paperclip className="w-3 h-3" />
              <span className="text-xs truncate max-w-[100px]">{file.name}</span>
              <button
                onClick={() => onRemoveFile(index)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Attachment button */}
      <Button
        type="button"
        variant="ghost"
        size={isMobile ? "sm" : "icon"}
        onClick={handleFileAttachment}
        className={cn(
          "shrink-0 touch-target",
          "text-muted-foreground hover:text-foreground",
          isMobile && "h-8 w-8",
          className
        )}
      >
        <Paperclip className={cn("w-4 h-4", isMobile && "w-3.5 h-3.5")} />
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
