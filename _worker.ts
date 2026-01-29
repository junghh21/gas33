
import { GoogleGenAI } from "@google/genai";

interface Env {
  API_KEY: string;
  ASSETS: { fetch: typeof fetch };
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    // API 요청 처리
    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const { topic, question, systemInstruction } = await request.json();
        
        if (!env.API_KEY) {
          return new Response(JSON.stringify({ error: "API_KEY가 워커 환경변수에 설정되지 않았습니다." }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }

        const ai = new GoogleGenAI({ apiKey: env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: question 
            ? `'${topic}' 분야의 다음 질문에 대해 상세히 설명해줘: ${question}`
            : `'${topic}'에 대한 핵심 요약 정리를 해줘.`,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });

        return new Response(JSON.stringify({ text: response.text }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // 정적 자산 서빙 (Cloudflare Pages 기본 동작)
    return env.ASSETS.fetch(request);
  }
};
