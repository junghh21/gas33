
import React, { useEffect, useRef } from 'react';

interface Props {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<Props> = ({ content, className = "" }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      // 1. marked 옵션 설정 (줄바꿈 보존 등)
      (window as any).marked.setOptions({
        breaks: true,
        gfm: true
      });

      // 2. 마크다운 -> HTML 변환
      try {
        const rawHtml = (window as any).marked.parse(content);
        rootRef.current.innerHTML = rawHtml;

        // 3. KaTeX 수식 렌더링
        (window as any).renderMathInElement(rootRef.current, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
          ],
          throwOnError: false,
          ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"]
        });
      } catch (e) {
        console.error("Rendering error:", e);
        rootRef.current.innerText = content;
      }
    }
  }, [content]);

  return (
    <div 
      ref={rootRef} 
      className={`prose prose-sm md:prose-base prose-blue dark:prose-invert max-w-none transition-colors duration-300 ${className}`}
    />
  );
};

export default MarkdownRenderer;
