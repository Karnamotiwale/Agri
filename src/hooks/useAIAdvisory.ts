import { useState } from 'react';
import { askAI } from '../services/aiAdvisoryService';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function useAIAdvisory() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (question: string) => {
    if (!question.trim()) return;
    
    const userMessage: ChatMessage = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const answer = await askAI(question);
      const assistantMessage: ChatMessage = { role: 'assistant', content: answer };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('AI Advisory Error:', err);
      setError(err.message || 'Failed to get response');
      const errorMessage: ChatMessage = { role: 'assistant', content: 'Sorry, I am facing some technical difficulties. Please try again later.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, error, sendMessage };
}
