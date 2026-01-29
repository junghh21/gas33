
import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';

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

  return (
    <div 
      ref={rootRef} 
      className={`prose prose-sm md:prose-base prose-blue dark:prose-invert max-w-none transition-colors duration-300 ${className}`}
    />
  );
};

export default MarkdownRenderer;
