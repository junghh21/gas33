
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const API_KEY = process.env.API_KEY || "";

export const generateExplanation = async (topic: string, question?: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    당신은 가스기사(Gas Engineer) 자격증 시험 전문 튜터입니다.
    사용자가 질문하는 가스 관련 기술 개념, 법규, 연소공학 수식 등을 전문적이고 이해하기 쉽게 설명하세요.
    수식은 반드시 KaTeX 형식(예: $CH_4$)을 사용하여 작성하세요.
    답변은 Markdown 형식을 유지하세요.
  `;

  const prompt = question 
    ? `'${topic}' 분야의 다음 질문에 대해 상세히 설명해줘: ${question}`
    : `'${topic}'에 대한 핵심 요약 정리를 해줘.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });
    return response.text || "답변을 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 튜터와 연결하는 중 오류가 발생했습니다.";
  }
};

export const startAIChat = (systemInstruction: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction }
  });
};
