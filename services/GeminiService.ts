
import { GoogleGenAI } from "@google/genai";

class GeminiService {
  private ai: GoogleGenAI | null = null;

  private init() {
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  async ask(prompt: string, systemInstruction?: string): Promise<string> {
    this.init();
    if (!this.ai) return "نواة الذكاء غير مفعلة. يرجى إعداد مفتاح API في الإعدادات.";

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "أنت العقل المدبر لنظام ZOOKA OS. أجب بدقة واستراتيجية.",
          thinkingConfig: { thinkingBudget: 1024 }
        }
      });
      return response.text || "لم يتم استلام رد.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "عطل في النواة المركزية.";
    }
  }
}

export const gemini = new GeminiService();
