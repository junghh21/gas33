
import { GoogleGenAI } from "@google/genai";

interface Env {
  API_KEY: string;
  ASSETS: { fetch: typeof fetch };
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    // AI Generation API Endpoint
    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const { topic, question, systemInstruction } = await request.json();
        
        // Use the API key exclusively from process.env.API_KEY as per the strict prompt requirement
        const apiKey = process.env.API_KEY;
        
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "API_KEY configuration missing in process.env." }), { 
            status: 500,
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          });
        }

        const ai = new GoogleGenAI({ apiKey });
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
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { 
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
    }

    // Default: Serve static assets
    return env.ASSETS.fetch(request);
  }
};
