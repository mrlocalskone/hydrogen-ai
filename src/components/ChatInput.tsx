
import React from 'react';
import { cn } from "@/lib/utils";
import { ChatInputForm } from "./chat/ChatInputForm";
import { useChatInput } from "@/hooks/useChatInput";

export const ChatInput: React.FC = () => {
  const {
    input,
    setInput,
    attachedFiles,
    textareaRef,
    isMobile,
    handleSubmit,
    handleKeyDown,
    handleVoiceResult,
    handleFileChange,
    removeFile
  } = useChatInput();

  return (
    <div className={cn(
      "sticky bottom-0 z-50 w-full",
      "bg-gradient-to-t from-background via-background/98 to-background/95",
      "backdrop-blur-xl border-t border-border/50",
      "shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)]",
      "dark:shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.6)]",
      isMobile ? "p-4 pb-safe-bottom" : "p-6"
    )}>
      <div className={cn(
        "max-w-4xl mx-auto relative",
        "before:absolute before:inset-0 before:-z-10",
        "before:bg-gradient-to-r before:from-primary/5 before:via-transparent before:to-primary/5",
        "before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-500",
        "focus-within:before:opacity-100",
        "animate-fade-in"
      )}>
        <ChatInputForm
          input={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          attachedFiles={attachedFiles}
          onFileChange={handleFileChange}
          onRemoveFile={removeFile}
          onVoiceResult={handleVoiceResult}
          textareaRef={textareaRef}
          isMobile={isMobile}
        />
        
        {/* Dynamic glow effect */}
        <div className={cn(
          "absolute -inset-1 -z-20 rounded-2xl opacity-0 transition-all duration-700",
          "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20",
          "blur-xl",
          input.trim() && "opacity-100 animate-pulse"
        )} />
      </div>
    </div>
  );
};
