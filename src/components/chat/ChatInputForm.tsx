
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileAttachmentHandler } from "./FileAttachmentHandler";
import { VoiceInputHandler } from "./VoiceInputHandler";

interface ChatInputFormProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  attachedFiles: File[];
  onFileChange: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onVoiceResult: (text: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  isMobile?: boolean;
  disabled?: boolean;
}

export const ChatInputForm: React.FC<ChatInputFormProps> = ({
  input,
  onInputChange,
  onSubmit,
  onKeyDown,
  attachedFiles,
  onFileChange,
  onRemoveFile,
  onVoiceResult,
  textareaRef,
  isMobile = false,
  disabled = false
}) => {
  const getSendButtonText = () => {
    if (isMobile && input.trim()) return '';
    return isMobile ? '' : 'Send';
  };

  return (
    <form onSubmit={onSubmit} className="relative">
      <FileAttachmentHandler
        attachedFiles={attachedFiles}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        isMobile={isMobile}
      />

      <div className={cn(
        "relative flex items-end gap-2 p-3 rounded-xl border border-border bg-background/50",
        "focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20",
        "transition-all duration-200",
        isMobile && "p-2"
      )}>
        <FileAttachmentHandler
          attachedFiles={[]}
          onFileChange={onFileChange}
          onRemoveFile={onRemoveFile}
          isMobile={isMobile}
        />

        {/* Text input */}
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            isMobile 
              ? "Type your message..." 
              : "Type your message... (Enter to send, Shift+Enter for new line)"
          }
          className={cn(
            "flex-1 min-h-[40px] max-h-[150px] resize-none border-0 bg-transparent",
            "focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground",
            "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
            isMobile && "text-base leading-5 py-2"
          )}
          rows={1}
          style={{ 
            fontSize: isMobile ? '16px' : '14px'
          }}
          disabled={disabled}
        />

        <VoiceInputHandler
          onTextCapture={onVoiceResult}
          isMobile={isMobile}
        />

        {/* Send button */}
        <Button
          type="submit"
          size={isMobile ? "sm" : "icon"}
          disabled={(!input.trim() && attachedFiles.length === 0) || disabled}
          className={cn(
            "shrink-0 touch-target",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200",
            isMobile && "h-8 w-8 min-w-[32px]"
          )}
        >
          <Send className={cn("w-4 h-4", isMobile && "w-3.5 h-3.5")} />
          {!isMobile && getSendButtonText() && (
            <span className="ml-2">{getSendButtonText()}</span>
          )}
        </Button>
      </div>

      {/* Mobile helper text */}
      {isMobile && (
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Shift + Enter to send • Enter for new line
        </div>
      )}
    </form>
  );
};
