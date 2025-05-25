
import React from 'react';
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { cn } from "@/lib/utils";

interface VoiceInputHandlerProps {
  onTextCapture: (text: string) => void;
  isMobile?: boolean;
  className?: string;
}

export const VoiceInputHandler: React.FC<VoiceInputHandlerProps> = ({
  onTextCapture,
  isMobile = false,
  className
}) => {
  return (
    <div className={cn(
      "relative group",
      className
    )}>
      {/* Voice input glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-full bg-primary/20",
        "scale-0 group-hover:scale-110 transition-all duration-300",
        "animate-pulse opacity-0 group-hover:opacity-100"
      )} />
      
      <AIVoiceInput
        onTextCapture={onTextCapture}
        className={cn(
          "relative z-10 transition-all duration-300",
          "hover:scale-110 active:scale-95",
          isMobile && "h-8 w-8"
        )}
      />
    </div>
  );
};
