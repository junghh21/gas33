
import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import renderMathInElement from 'katex-auto-render';

interface Props {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<Props> = ({ content, className = "" }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      // 1. marked 기본 설정
      marked.setOptions({
        breaks: true,
        gfm: true
      });

      // 2. 마크다운 -> HTML 변환 및 수식 렌더링 실행
      try {
        const rawHtml = marked.parse(content);
        
        if (typeof rawHtml === 'string') {
          rootRef.current.innerHTML = rawHtml;
          applyKaTeX(rootRef.current);
        } else if (rawHtml instanceof Promise) {
          rawHtml.then(html => {
            if (rootRef.current) {
              rootRef.current.innerHTML = html;
              applyKaTeX(rootRef.current);
            }
          });
        }
      } catch (e) {
        console.error("Markdown rendering error:", e);
        if (rootRef.current) rootRef.current.innerText = content;
      }
    }
  }, [content]);

  // KaTeX 자동 렌더링 함수
  const applyKaTeX = (element: HTMLElement) => {
    try {
      renderMathInElement(element, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false,
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"]
      });
    } catch (err) {
      console.error("KaTeX error:", err);
    }
  };

  return (
    <div 
      ref={rootRef} 
      className={`prose prose-sm md:prose-base prose-blue dark:prose-invert max-w-none transition-colors duration-300 ${className}`}
    />
  );
};

export default MarkdownRenderer;
