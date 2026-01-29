
import { GoogleGenAI } from "@google/genai";

export const generateExplanation = async (topic: string, question?: string) => {
  // Always create a new instance to ensure we use the correct API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const modelName = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    당신은 가스기사(Gas Engineer) 자격증 시험 전문 튜터입니다.
    사용자가 질문하는 가스 관련 기술 개념, 법규, 연소공학 수식 등을 전문적이고 이해하기 쉽게 설명하세요.
    
    [출력 가이드라인]
    1. 수식은 반드시 KaTeX 형식($ ... $ 또는 $$ ... $$)을 사용하세요.
       - 예: 화학식 $CH_4$, 압력 공식 $P = \gamma h$
       - 복잡한 공식은 반드시 $$ ... $$ 블록 형식을 사용하세요.
    2. 중요한 요약은 Markdown Table을 사용하여 가독성을 높이세요.
    3. 단계별 설명이 필요한 경우 순서가 있는 리스트(1, 2, 3)를 사용하세요.
    4. 답변은 Markdown 형식을 유지하세요.
  `;

  const prompt = question 
    ? `'${topic}' 분야의 다음 질문에 대해 상세히 설명해줘: ${question}`
    : `'${topic}'에 대한 핵심 요약 정리를 해줘.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });
    return response.text || "답변을 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 튜터와 연결하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const startAIChat = (systemInstruction: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction }
  });
};
