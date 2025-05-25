
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
      "border-t border-white/10 light:border-black/10 bg-background/95 backdrop-blur-md",
      isMobile ? "p-4 pb-safe-bottom" : "p-6"
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
    </div>
  );
};
