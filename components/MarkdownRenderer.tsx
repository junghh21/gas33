
import React, { useEffect, useRef } from 'https://esm.sh/react@19.0.0';
import { marked } from 'https://esm.sh/marked@11.1.1';
import renderMathInElement from 'https://esm.sh/katex@0.16.9/dist/contrib/auto-render.mjs';

interface Props {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<Props> = ({ content, className = "" }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const renderContent = async () => {
      if (!rootRef.current) return;

      marked.setOptions({
        breaks: true,
        gfm: true
      });

      try {
        // 1. 마크다운을 HTML로 변환합니다.
        const rawHtml = await marked.parse(content);
        
        if (isMounted && rootRef.current) {
          // KaTeX 실행 전에 먼저 HTML을 주입하여 "빈 요소"가 보이는 시간을 최소화하고,
          // 이후 KaTeX 단계에서 오류가 나더라도 최소한의 텍스트는 보이게 합니다.
          rootRef.current.innerHTML = rawHtml;
          
          try {
            // 2. KaTeX를 사용하여 수학 수식을 렌더링합니다.
            renderMathInElement(rootRef.current, {
              delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false },
                { left: "\\(", right: "\\)", display: false },
                { left: "\\[", right: "\\]", display: true }
              ],
              throwOnError: false
            });
          } catch (mathError) {
            // KaTeX 렌더링 중 오류가 발생하더라도 이미 HTML은 주입된 상태이므로
            // 사용자는 마운트된 HTML 내용을 볼 수 있습니다. (Graceful Degradation)
            console.warn("KaTeX rendering error (Degrading to raw text for formulas):", mathError);
          }
        }
      } catch (e) {
        console.error("Markdown rendering error:", e);
        // 마크다운 파싱 자체가 실패한 경우에만 원본 텍스트를 직접 노출합니다.
        if (isMounted && rootRef.current) {
          rootRef.current.innerText = content;
        }
      }
    };

    renderContent();

    return () => {
      isMounted = false;
    };
  }, [content]);

  return (
    <div 
      ref={rootRef} 
      className={`prose prose-sm md:prose-base prose-blue dark:prose-invert max-w-none transition-colors duration-300 ${className}`}
    />
  );
};

export default MarkdownRenderer;
