
import { GoogleGenAI } from "@google/genai";

interface Env {
  API_KEY: string;
  ASSETS: { fetch: typeof fetch };
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    // 1. JSON Data API Endpoint
    if (url.pathname.startsWith("/api/json/") && request.method === "GET") {
      try {
        const id = url.pathname.split("/").pop();
        if (!id) throw new Error("Missing ID");
        
        // Fetch the static asset via internal ASSETS binding
        const assetResponse = await env.ASSETS.fetch(new Request(new URL(`/json/${id}.json`, request.url)));
        
        if (!assetResponse.ok) {
          return new Response(JSON.stringify({ error: "Data file not found" }), { 
            status: 404, 
            headers: { "Content-Type": "application/json" } 
          });
        }

        const data = await assetResponse.json();
        return new Response(JSON.stringify(data), {
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
    }

    // 2. AI Generation API Endpoint
    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const { topic, question, systemInstruction } = await request.json();
        const apiKey = process.env.API_KEY;
        
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "API_KEY configuration missing." }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
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
          headers: { "Content-Type": "application/json" }
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
    }

    // Default: Serve static assets
    return env.ASSETS.fetch(request);
  }
};
