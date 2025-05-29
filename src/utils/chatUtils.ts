
import { v4 as uuidv4 } from "uuid";
import { Conversation, ChatState } from "@/types/chat";
import { MessageRole } from "@/types/message";

// Default API configuration
export const DEFAULT_API_CONFIG = {
  key: 'AIzaSyApy8Nw8M6PeUWtKapURmaZnuH4lWogN6I',
  url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
};

// Initial message shown to the user
export const WELCOME_MESSAGE = `
<h2>Welcome to HydroGen</h2>
<p>I'm here to provide detailed answers, visualizations, and insights. Try asking me something!</p>
`;

// Get stored API key or use default
export const getStoredApiKey = (): string => {
  return localStorage.getItem("gemini-api-key") || DEFAULT_API_CONFIG.key;
};

// Get stored API URL or use default
export const getStoredApiUrl = (): string => {
  return localStorage.getItem("gemini-api-url") || DEFAULT_API_CONFIG.url;
};

// Get stored model or use default
export const getStoredModel = (): string => {
  return localStorage.getItem("app-model") || "gemini-2.0-flash";
};

// Get stored conversations
export const getStoredConversations = (): Conversation[] => {
  const stored = localStorage.getItem("conversations");
  if (!stored) return [];
  
  try {
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return parsed.map((conv: any) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      lastUpdatedAt: new Date(conv.lastUpdatedAt),
    }));
  } catch (e) {
    console.error("Error parsing stored conversations:", e);
    return [];
  }
};

// Create a new conversation with a welcome message
export const createInitialConversation = (): Conversation => {
  const now = new Date();
  return {
    id: uuidv4(),
    title: "New chat",
    messages: [
      {
        id: "welcome",
        role: "assistant" as MessageRole,
        content: WELCOME_MESSAGE,
        timestamp: now,
      },
    ],
    createdAt: now,
    lastUpdatedAt: now,
  };
};

// Initialize chat state
export const initializeChatState = (): ChatState => {
  const state: ChatState = {
    messages: [
      {
        id: "welcome",
        role: "assistant",
        content: WELCOME_MESSAGE,
        timestamp: new Date(),
      },
    ],
    apiKey: getStoredApiKey(),
    apiUrl: getStoredApiUrl(),
    isProcessing: false,
    conversations: getStoredConversations(),
    currentConversationId: null,
    model: getStoredModel(),
    activeAtom: null,
    atomParams: '',
  };

  // If no conversations exist, create an initial one
  if (state.conversations.length === 0) {
    const initialConversation = createInitialConversation();
    state.conversations = [initialConversation];
    state.currentConversationId = initialConversation.id;
  } else {
    // Use the first conversation as current if none is set
    state.currentConversationId = state.conversations[0].id;
    // Set initial messages to the current conversation's messages
    const currentConv = state.conversations.find(c => c.id === state.currentConversationId);
    if (currentConv) {
      state.messages = currentConv.messages;
    }
  }
  
  return state;
};
