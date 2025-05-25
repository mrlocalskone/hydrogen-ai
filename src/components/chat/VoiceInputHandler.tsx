
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
    <AIVoiceInput
      onTextCapture={onTextCapture}
      className={cn(
        "shrink-0 touch-target",
        isMobile && "h-8 w-8",
        className
      )}
    />
  );
};
