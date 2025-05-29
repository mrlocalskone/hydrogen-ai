
export type AtomType = 'youtube' | 'flashcard' | 'websearch' | 'summarize' | 'studyguide' | 'mindmap' | 'conceptmap' | 'pdfsummarizer' | 'diagram' | null;

export interface AtomCommand {
  type: AtomType;
  params: string;
}

export function parseAtomCommand(message: string): AtomCommand | null {
  if (message.startsWith('/youtube') || message.startsWith('/yt')) {
    const params = message.startsWith('/youtube') ? 
      message.substring(9).trim() : 
      message.substring(4).trim();
    return { type: 'youtube', params };
  } else if (message.startsWith('/flashcard') || message.startsWith('/fc')) {
    const params = message.startsWith('/flashcard') ? 
      message.substring(11).trim() : 
      message.substring(4).trim();
    return { type: 'flashcard', params };
  } else if (message.startsWith('/web') || message.startsWith('/search')) {
    const params = message.startsWith('/web') ? 
      message.substring(5).trim() : 
      message.substring(8).trim();
    return { type: 'websearch', params };
  } else if (message.startsWith('/summarize') || message.startsWith('/sum')) {
    const params = message.startsWith('/summarize') ? 
      message.substring(11).trim() : 
      message.substring(5).trim();
    return { type: 'summarize', params };
  } else if (message.startsWith('/mindmap') || message.startsWith('/mm')) {
    const params = message.startsWith('/mindmap') ? 
      message.substring(9).trim() : 
      message.substring(4).trim();
    return { type: 'mindmap', params };
  } else if (message.startsWith('/conceptmap') || message.startsWith('/cm')) {
    const params = message.startsWith('/conceptmap') ? 
      message.substring(12).trim() : 
      message.substring(4).trim();
    return { type: 'conceptmap', params };
  } else if (message.startsWith('/studyguide') || message.startsWith('/sg')) {
    const params = message.startsWith('/studyguide') ? 
      message.substring(12).trim() : 
      message.substring(4).trim();
    return { type: 'studyguide', params };
  } else if (message.startsWith('/pdf') || message.startsWith('/pdfsummarizer')) {
    const params = message.startsWith('/pdfsummarizer') ? 
      message.substring(15).trim() : 
      message.substring(5).trim();
    return { type: 'pdfsummarizer', params };
  } else if (message.startsWith('/diagram') || message.startsWith('/mermaid')) {
    const params = message.startsWith('/diagram') ?
      message.substring(9).trim() :
      message.substring(8).trim();
    return { type: 'diagram', params };
  }
  return null;
}
