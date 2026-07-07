import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage } from '../types/hr';

export function useGemini() {
  const [apiKey, setApiKeyState] = useState(() => localStorage.getItem('hr-dashboard-gemini-key') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    localStorage.setItem('hr-dashboard-gemini-key', key);
  }, []);

  const generateReport = useCallback(async (dataSummary: string): Promise<string> => {
    if (!apiKey) throw new Error('API key not configured');
    setIsGenerating(true);
    setError(null);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Bạn là chuyên gia phân tích nhân sự. Dựa trên dữ liệu sau:
${dataSummary}
Hãy viết báo cáo phân tích sâu sắc bằng tiếng Việt gồm: Tóm tắt, Cơ cấu nhân sự, Lương, Hiệu suất, Gắn kết, Nghỉ việc, Rủi ro, Khuyến nghị.`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [apiKey]);

  const chat = useCallback(async (message: string, dataSummary: string, history: ChatMessage[]): Promise<string> => {
    if (!apiKey) throw new Error('API key not configured');
    setIsChatting(true);
    setError(null);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Bạn là trợ lý HR. Dữ liệu HR:
${dataSummary}
Câu hỏi: ${message}
Trả lời chuyên nghiệp bằng tiếng Việt.`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsChatting(false);
    }
  }, [apiKey]);

  return { apiKey, setApiKey, generateReport, chat, isGenerating, isChatting, error };
}