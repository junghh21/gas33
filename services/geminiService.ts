
export const generateExplanation = async (topic: string, question?: string) => {
  const systemInstruction = `
    당신은 가스기사(Gas Engineer) 자격증 시험 전문 튜터입니다.
    사용자가 질문하는 가스 관련 기술 개념, 법규, 연소공학 수식 등을 전문적이고 이해하기 쉽게 설명하세요.
    
    [출력 가이드라인]
    1. 수식이나 화학식은 일반 텍스트나 가독성 좋은 기호를 사용하여 설명하세요. 특수한 수학 렌더링 문법(KaTeX/LaTeX)은 사용하지 마세요.
    2. 중요한 요약은 Markdown Table을 사용하여 가독성을 높이세요.
    3. 답변은 Markdown 형식을 유지하세요.
  `;

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, question, systemInstruction }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "서버 응답 오류");
    }

    const data = await response.json();
    return data.text || "답변을 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Proxy Error:", error);
    return `AI 튜터와 연결하는 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`;
  }
};

// Chat 기능도 필요한 경우 프록시로 구현해야 함. 현재는 generateExplanation 위주로 사용됨.
export const startAIChat = (systemInstruction: string) => {
  console.warn("Direct SDK Chat is deprecated. Use API endpoints instead.");
  return null;
};
