
import { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from "@/context/ChatContext";
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

export const useChatInput = () => {
  const isMobile = useIsMobile();
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
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
          setActiveAtom('websearch', query);
          return;
        }
      }

      if (messageText.startsWith('/youtube ')) {
        const url = messageText.replace('/youtube ', '').trim();
        if (url) {
          setActiveAtom('youtube', url);
          return;
        }
      }

      if (messageText.startsWith('/flashcard ')) {
        const topic = messageText.replace('/flashcard ', '').trim();
        if (topic) {
          setActiveAtom('flashcard', topic);
          return;
        }
      }

      if (messageText.startsWith('/summarize ')) {
        const content = messageText.replace('/summarize ', '').trim();
        if (content) {
          setActiveAtom('summarize', content);
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
  };

  const handleFileChange = (files: File[]) => {
    setAttachedFiles(files);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return {
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
  };
};
