
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff, Paperclip, Sparkles } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { toast } from "@/components/ui/use-toast";

// Hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  return isMobile;
};

export const ChatInput: React.FC = () => {
  const isMobile = useIsMobile();
  const [input, setInput] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    sendMessage, 
    conversations, 
    currentConversationId,
    createNewConversation,
    setActiveAtom 
  } = useChat();

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const maxHeight = isMobile ? 120 : 150;
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  }, [isMobile]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input, adjustTextareaHeight]);

  // Create initial conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation();
    }
  }, [conversations, createNewConversation]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim() && attachedFiles.length === 0) return;

    const messageText = input.trim();
    
    // Clear input immediately for better UX
    setInput('');
    setAttachedFiles([]);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // Handle special atom commands
      if (messageText.startsWith('/web ')) {
        const query = messageText.replace('/web ', '').trim();
        if (query) {
          setActiveAtom({ 
            type: 'web-search' as const, 
            params: { query },
            isVisible: true 
          });
          return;
        }
      }

      if (messageText.startsWith('/youtube ')) {
        const url = messageText.replace('/youtube ', '').trim();
        if (url) {
          setActiveAtom({ 
            type: 'youtube-summarizer' as const, 
            params: { url },
            isVisible: true 
          });
          return;
        }
      }

      if (messageText.startsWith('/flashcard ')) {
        const topic = messageText.replace('/flashcard ', '').trim();
        if (topic) {
          setActiveAtom({ 
            type: 'flashcard-maker' as const, 
            params: { topic },
            isVisible: true 
          });
          return;
        }
      }

      if (messageText.startsWith('/summarize ')) {
        const content = messageText.replace('/summarize ', '').trim();
        if (content) {
          setActiveAtom({ 
            type: 'ai-summarizer' as const, 
            params: { content },
            isVisible: true 
          });
          return;
        }
      }

      // Send regular message
      await sendMessage(messageText);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message Failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (isMobile) {
        // On mobile, Enter creates a new line, Shift+Enter sends
        if (e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
      } else {
        // On desktop, Enter sends, Shift+Enter creates new line
        if (!e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
      }
    }
  };

  const handleVoiceResult = (transcript: string) => {
    setInput(prev => prev + transcript);
    setIsVoiceActive(false);
    setIsListening(false);
  };

  const handleFileAttachment = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getSendButtonText = () => {
    if (isMobile && input.trim()) return '';
    return isMobile ? '' : 'Send';
  };

  return (
    <div className={cn(
      "border-t border-white/10 light:border-black/10 bg-background/95 backdrop-blur-md",
      isMobile ? "p-4 safe-bottom" : "p-6"
    )}>
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
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          "relative flex items-end gap-2 p-3 rounded-xl border border-border bg-background/50",
          "focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20",
          "transition-all duration-200",
          isMobile && "p-2"
        )}>
          {/* Attachment button */}
          <Button
            type="button"
            variant="ghost"
            size={isMobile ? "sm" : "icon"}
            onClick={handleFileAttachment}
            className={cn(
              "shrink-0 touch-target",
              "text-muted-foreground hover:text-foreground",
              isMobile && "h-8 w-8"
            )}
          >
            <Paperclip className={cn("w-4 h-4", isMobile && "w-3.5 h-3.5")} />
          </Button>

          {/* Text input */}
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isMobile 
                ? "Type your message..." 
                : "Type your message... (Enter to send, Shift+Enter for new line)"
            }
            className={cn(
              "flex-1 min-h-[40px] max-h-[150px] resize-none border-0 bg-transparent",
              "focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground",
              "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
              isMobile && "text-base leading-5 py-2" // Prevent zoom on iOS
            )}
            rows={1}
            style={{ 
              fontSize: isMobile ? '16px' : '14px' // Prevent zoom on iOS
            }}
          />

          {/* Voice input button */}
          <AIVoiceInput
            onResult={handleVoiceResult}
            onListeningChange={setIsListening}
            className={cn(
              "shrink-0 touch-target",
              isMobile && "h-8 w-8"
            )}
          />

          {/* Send button */}
          <Button
            type="submit"
            size={isMobile ? "sm" : "icon"}
            disabled={!input.trim() && attachedFiles.length === 0}
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

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </form>
    </div>
  );
};
