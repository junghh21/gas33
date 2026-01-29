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

      // Custom renderer to wrap tables for mobile responsiveness
      const renderer = new marked.Renderer();
      const originalTable = renderer.table.bind(renderer);
      renderer.table = (header: string, body: string) => {
        const tableHtml = originalTable(header, body);
        return `<div class="table-wrapper my-6 overflow-x-auto shadow-sm border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900/50">
          ${tableHtml}
        </div>`;
      };

      marked.setOptions({
        breaks: true,
        gfm: true,
        renderer
      });

      try {
        const rawHtml = await marked.parse(content);
        
        if (isMounted && rootRef.current) {
          // 1. Inject HTML Content
          rootRef.current.innerHTML = rawHtml;
          
          // 2. Render Math in element
          // We use a small timeout to ensure DOM layout is ready and document mode is checked
          setTimeout(() => {
            if (isMounted && rootRef.current) {
              try {
                renderMathInElement(rootRef.current, {
                  delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false },
                    { left: "\\(", right: "\\)", display: false },
                    { left: "\\[", right: "\\]", display: true }
                  ],
                  ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
                  throwOnError: false
                });
              } catch (mathErr) {
                console.warn("KaTeX non-fatal error during auto-render:", mathErr);
              }
            }
          }, 10);
        }
      } catch (e) {
        console.error("Markdown parsing error:", e);
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