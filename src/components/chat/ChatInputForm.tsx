
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles } from "lucide-react";
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
  const hasContent = input.trim() || attachedFiles.length > 0;

  return (
    <form onSubmit={onSubmit} className="relative group">
      {/* File attachments preview */}
      <FileAttachmentHandler
        attachedFiles={attachedFiles}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        isMobile={isMobile}
      />

      {/* Main input container */}
      <div className={cn(
        "relative flex items-end gap-3 rounded-2xl transition-all duration-300",
        "border-2 bg-background/80 backdrop-blur-md",
        "shadow-lg hover:shadow-xl",
        hasContent 
          ? "border-primary/50 bg-background/90" 
          : "border-border/30 hover:border-border/60",
        "focus-within:border-primary focus-within:shadow-primary/20",
        "group-hover:shadow-xl group-hover:scale-[1.01]",
        isMobile ? "p-3" : "p-4"
      )}>
        {/* Animated border gradient */}
        <div className={cn(
          "absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-500",
          "bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30",
          "animate-gradient-x",
          hasContent && "opacity-100"
        )} />

        {/* Left side controls */}
        <div className="flex items-center gap-2">
          <FileAttachmentHandler
            attachedFiles={[]}
            onFileChange={onFileChange}
            onRemoveFile={onRemoveFile}
            isMobile={isMobile}
            className={cn(
              "transition-all duration-300 hover:scale-110",
              "hover:bg-primary/10 hover:text-primary"
            )}
          />
        </div>

        {/* Text input area */}
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={
              isMobile 
                ? "Ask me anything..." 
                : "Ask me anything... (Enter to send, Shift+Enter for new line)"
            }
            className={cn(
              "min-h-[50px] max-h-[200px] resize-none border-0 bg-transparent",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-muted-foreground/60 placeholder:transition-colors",
              "focus:placeholder:text-muted-foreground/40",
              "scrollbar-thin scrollbar-thumb-border/30 scrollbar-track-transparent",
              "transition-all duration-200",
              isMobile ? "text-base leading-6 py-3" : "text-sm leading-6 py-3",
              hasContent && "placeholder:text-transparent"
            )}
            rows={1}
            disabled={disabled}
          />
          
          {/* Dynamic placeholder effect */}
          {!input && (
            <div className={cn(
              "absolute inset-0 pointer-events-none flex items-center px-3",
              "text-muted-foreground/40 transition-all duration-300",
              "animate-pulse"
            )}>
              <Sparkles className="w-4 h-4 mr-2 animate-spin-slow" />
              <span className="animate-fade-in">Start typing to see the magic...</span>
            </div>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <VoiceInputHandler
            onTextCapture={onVoiceResult}
            isMobile={isMobile}
            className={cn(
              "transition-all duration-300 hover:scale-110",
              "hover:bg-primary/10 hover:text-primary"
            )}
          />

          {/* Enhanced send button */}
          <Button
            type="submit"
            disabled={!hasContent || disabled}
            className={cn(
              "relative overflow-hidden transition-all duration-300",
              "shadow-lg hover:shadow-xl",
              hasContent 
                ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 scale-100" 
                : "bg-muted/50 scale-95 opacity-50",
              "hover:scale-105 active:scale-95",
              isMobile ? "h-10 w-10 min-w-[40px]" : "h-11 w-11 min-w-[44px]",
              "rounded-xl"
            )}
          >
            {/* Button background animation */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent",
              "translate-x-[-100%] transition-transform duration-700",
              hasContent && "translate-x-[100%]"
            )} />
            
            <Send className={cn(
              "relative z-10 transition-all duration-300",
              isMobile ? "w-4 h-4" : "w-5 h-5",
              hasContent ? "text-white" : "text-muted-foreground",
              hasContent && "animate-bounce"
            )} />
          </Button>
        </div>
      </div>

      {/* Helper text with animation */}
      {isMobile && (
        <div className={cn(
          "text-xs text-center mt-3 transition-all duration-300",
          "text-muted-foreground/60 hover:text-muted-foreground/80",
          hasContent ? "animate-fade-in" : "animate-pulse"
        )}>
          Shift + Enter to send • Enter for new line
        </div>
      )}

      {/* Status indicator */}
      <div className={cn(
        "absolute -bottom-2 left-1/2 transform -translate-x-1/2",
        "w-16 h-1 rounded-full transition-all duration-500",
        hasContent 
          ? "bg-gradient-to-r from-primary/60 to-primary opacity-100" 
          : "bg-muted/30 opacity-0"
      )} />
    </form>
  );
};
