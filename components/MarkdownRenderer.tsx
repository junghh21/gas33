
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
    let isMounted = true;

    const renderContent = async () => {
      if (!rootRef.current) return;

      // marked configuration
      marked.setOptions({
        breaks: true,
        gfm: true
      });

      try {
        const rawHtml = await marked.parse(content);
        
        if (isMounted && rootRef.current) {
          rootRef.current.innerHTML = rawHtml;
          applyKaTeX(rootRef.current);
        }
      } catch (e) {
        console.error("Markdown rendering error:", e);
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

  const applyKaTeX = (element: HTMLElement) => {
    if (!element) return;
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
      console.warn("KaTeX auto-render failed:", err);
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
