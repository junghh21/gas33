import { GoogleGenAI } from "@google/genai";

interface Env {
  API_KEY: string;
  ASSETS: { fetch: typeof fetch };
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    // 1. JSON Data API Endpoint (Fallback & Diagnostic)
    if (url.pathname.startsWith("/api/json/")) {
      try {
        const id = url.pathname.split("/").pop();
        if (!id) throw new Error("Missing ID in URL");
        
        // Vite의 public 폴더에 저장된 파일은 루트 경로에서 바로 접근 가능합니다.
        // /api/json/gas_general -> /json/gas_general.json
        const internalPath = `/json/${id}.json`;
        const internalUrl = new URL(internalPath, url.origin);
        
        console.log(`[Worker Proxy] Fetching: ${internalPath}`);
        
        const internalRequest = new Request(internalUrl.toString(), {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'X-Worker-Origin': 'true'
          }
        });
        
        const assetResponse = await env.ASSETS.fetch(internalRequest);
        
        if (!assetResponse.ok) {
          console.error(`[Worker Proxy] 404 Not Found: ${internalPath}`);
          return new Response(JSON.stringify({ 
            error: `Module '${id}' not found. Ensure file exists at 'public${internalPath}'`,
            status: assetResponse.status 
          }), { 
            status: 404, 
            headers: { "Content-Type": "application/json" } 
          });
        }

        const response = new Response(assetResponse.body, assetResponse);
        response.headers.set("Content-Type", "application/json; charset=utf-8");
        return response;
        
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { 
          status: 500,
          headers: { "Content-Type": "application/json" } 
        });
      }
    }

    // 2. AI Generation API Endpoint
    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const { topic, question, systemInstruction } = await request.json();
        const ai = new GoogleGenAI({ apiKey: env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: question 
            ? `'${topic}'에 대한 질문: ${question}`
            : `'${topic}' 과목 핵심 요약`,
          config: { systemInstruction, temperature: 0.7 }
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

    return env.ASSETS.fetch(request);
  }
};