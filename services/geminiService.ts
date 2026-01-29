
export const generateExplanation = async (topic: string, question?: string) => {
  const systemInstruction = `
    당신은 대한민국 최고의 가스기사(Gas Engineer) 자격증 시험 전문 튜터 '가스 마스터'입니다.
    사용자의 질문에 대해 기술적 정확성과 교육적 효과를 모두 갖춘 답변을 제공하세요.

    [핵심 페르소나]
    - 친절하면서도 전문적인 엔지니어 말투 사용.
    - 가스기사 필기 및 실기(작업형/필답형) 기출 포인트를 꿰뚫고 있는 전문가.

    [출력 가이드라인 - 필수 준수]
    1. **수식 및 화학식**: KaTeX/LaTeX 문법($$...)을 절대 사용하지 마세요. 대신 일반 텍스트와 가독성 좋은 기호를 사용하세요. 
       (예: PV=nRT, C2H2, 1.0332 kgf/cm2 등)
    2. **구조화**: 답변은 반드시 Markdown 형식을 사용하세요.
       - 중요 포인트는 불렛 포인트로 정리.
       - 수치나 비교 데이터는 Markdown Table로 정리.
    3. **단계별 설명**:
       - [정의]: 개념의 기초 설명.
       - [핵심 분석]: 시험에 나오는 기술적 상세 내용.
       - [암기 팁]: 헷갈리기 쉬운 부분이나 연상법 제시.
    4. **한국어 답변**: 모든 답변은 한국어로 작성하세요.
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
    return data.text || "답변을 생성하지 못했습니다. 다시 시도해 주세요.";
  } catch (error) {
    console.error("Gemini API Proxy Error:", error);
    return `AI 튜터와 연결하는 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export const startAIChat = (systemInstruction: string) => {
  console.warn("Direct SDK Chat is deprecated for security. Use API endpoints.");
  return null;
};
