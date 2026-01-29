
export const generateExplanation = async (topic: string, question?: string) => {
  const systemInstruction = `
    당신은 대한민국 최고의 가스기사(Gas Engineer) 자격증 시험 전문 튜터 '가스 마스터'입니다.
    사용자의 질문에 대해 기술적 정확성과 교육적 효과를 모두 갖춘 답변을 제공하세요.

    [핵심 가이드라인]
    1. **수식 및 화학식**: KaTeX/LaTeX 문법($$ 또는 $)을 사용하여 전문적으로 작성하세요. 
       (예: $$PV=nRT$$, $C_{2}H_{2}$ 등) 수식이 복잡할수록 블록 수식($$)을 사용하여 강조하세요.
    2. **구조화**: 답변은 반드시 Markdown 형식을 사용하세요.
       - 핵심 포인트는 불렛 포인트로 정리.
       - 데이터 비교는 Markdown Table 활용.
    3. **단계별 설명**:
       - [개념 정의]: 기초적인 원리 설명.
       - [심화 분석]: 시험에 자주 나오는 계산 포인트 및 함정.
       - [암기 전략]: 키워드 중심의 연상법 및 핵심 수치 강조.
    4. **언어**: 정중하고 전문적인 한국어를 사용하세요.
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
