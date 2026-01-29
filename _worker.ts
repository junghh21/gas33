
import { GoogleGenAI } from "@google/genai";

interface Env {
  API_KEY: string;
  ASSETS: { fetch: typeof fetch };
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    // 1. JSON Data API Endpoint (Fallback for direct fetch & Diagnostic)
    if (url.pathname.startsWith("/api/json/")) {
      try {
        const id = url.pathname.split("/").pop();
        if (!id) throw new Error("Missing ID in URL");
        
        // Re-construct the internal asset path relative to origin
        const assetPath = `/json/${id}.json`;
        const assetUrl = new URL(assetPath, url.origin);
        
        console.log(`[Worker] Proxying request to internal asset: ${assetPath}`);
        
        // Use the original request as base to preserve environment-specific behaviors
        const internalRequest = new Request(assetUrl.toString(), {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'X-Internal-Proxy': 'true'
          }
        });
        
        const assetResponse = await env.ASSETS.fetch(internalRequest);
        
        if (!assetResponse.ok) {
          console.warn(`[Worker] Internal Asset Not Found: ${assetResponse.status} for ${id}`);
          return new Response(JSON.stringify({ 
            error: `Data module '${id}' not found in assets collection.`,
            path: assetPath,
            status: assetResponse.status 
          }), { 
            status: 404, 
            headers: { "Content-Type": "application/json" } 
          });
        }

        // Return the actual file content
        // We clone the response to modify headers if needed, ensuring it's recognized as JSON
        const response = new Response(assetResponse.body, assetResponse);
        response.headers.set("Content-Type", "application/json; charset=utf-8");
        return response;
        
      } catch (error: any) {
        console.error(`[Worker] Fatal Proxy Error:`, error);
        return new Response(JSON.stringify({ 
          error: error.message || "Internal Proxy Engine Error",
          stack: error.stack
        }), { 
          status: 500,
          headers: { "Content-Type": "application/json" } 
        });
      }
    }

    // 2. AI Generation API Endpoint (Gemini 3.0 Integration)
    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const { topic, question, systemInstruction } = await request.json();
        
        if (!env.API_KEY) {
          return new Response(JSON.stringify({ error: "Missing API_KEY environment variable." }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }

        const ai = new GoogleGenAI({ apiKey: env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: question 
            ? `'${topic}' 분야에 대해 다음 질문을 가스기사 전문가로서 설명해줘: ${question}`
            : `'${topic}' 과목에 대한 핵심 요약 및 학습 팁을 알려줘.`,
          config: {
            systemInstruction,
            temperature: 0.75,
            topP: 0.95,
          }
        });

        return new Response(JSON.stringify({ text: response.text }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (error: any) {
        console.error("[Worker] AI Generation Failed:", error);
        return new Response(JSON.stringify({ error: error.message }), { 
          status: 500,
          headers: { "Content-Type": "application/json" } 
        });
      }
    }

    // Default: Normal Static Asset Serving
    return env.ASSETS.fetch(request);
  }
};
