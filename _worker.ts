
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
        
        // Re-construct the internal asset path relative to the current host
        const newUrl = new URL(request.url);
        newUrl.pathname = `/json/${id}.json`;
        
        console.log(`[Worker] Proxying request to: ${newUrl.pathname}`);
        
        // ASSETS.fetch is sensitive to the request object.
        // We create a fresh request to ensure no stale headers interfere.
        const internalRequest = new Request(newUrl.toString(), {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'X-Worker-Proxy': 'true'
          }
        });
        
        const assetResponse = await env.ASSETS.fetch(internalRequest);
        
        if (!assetResponse.ok) {
          console.warn(`[Worker] Internal Asset fetch failed: ${assetResponse.status} for ${id}`);
          return new Response(JSON.stringify({ 
            error: `Data module '${id}' not found in internal build assets.`,
            status: assetResponse.status,
            path: newUrl.pathname
          }), { 
            status: 404, 
            headers: { "Content-Type": "application/json" } 
          });
        }

        // Return the asset as is, but force the content-type to JSON just in case.
        const finalResponse = new Response(assetResponse.body, assetResponse);
        finalResponse.headers.set("Content-Type", "application/json; charset=utf-8");
        return finalResponse;

      } catch (error: any) {
        console.error(`[Worker] Proxy Engine Fatal Error:`, error);
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
          return new Response(JSON.stringify({ error: "Missing server-side API_KEY." }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }

        const ai = new GoogleGenAI({ apiKey: env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: question 
            ? `'${topic}' 분야에 대해 다음 질문을 가스기사 전문가로서 상세히 설명해줘: ${question}`
            : `'${topic}' 과목에 대한 핵심 요약 및 암기 비법을 알려줘.`,
          config: {
            systemInstruction,
            temperature: 0.7,
            topP: 0.9,
          }
        });

        return new Response(JSON.stringify({ text: response.text }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (error: any) {
        console.error("[Worker] AI Tutoring Failed:", error);
        return new Response(JSON.stringify({ error: error.message }), { 
          status: 500,
          headers: { "Content-Type": "application/json" } 
        });
      }
    }

    // Default: Serve static assets via Cloudflare Pages internal mechanism
    return env.ASSETS.fetch(request);
  }
};
