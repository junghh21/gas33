
import React, { useEffect, useRef } from 'react';

interface Props {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<Props> = ({ content, className = "" }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      // 1. Convert Markdown to HTML
      const rawHtml = (window as any).marked.parse(content);
      rootRef.current.innerHTML = rawHtml;

      // 2. Render LaTeX using KaTeX
      const walkAndRender = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
          const text = node.textContent;
          const regex = /\$([^$]+)\$/g;
          let match;
          let lastIndex = 0;
          const fragments: (string | HTMLElement)[] = [];

          while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
              fragments.push(text.substring(lastIndex, match.index));
            }
            const span = document.createElement('span');
            try {
              (window as any).katex.render(match[1], span, { throwOnError: false });
              fragments.push(span);
            } catch (e) {
              fragments.push(match[0]);
            }
            lastIndex = regex.lastIndex;
          }

          if (lastIndex < text.length) {
            fragments.push(text.substring(lastIndex));
          }

          if (fragments.length > 1 || (fragments.length === 1 && typeof fragments[0] !== 'string')) {
            const parent = node.parentNode;
            if (parent) {
              fragments.forEach(frag => {
                if (typeof frag === 'string') {
                  parent.insertBefore(document.createTextNode(frag), node);
                } else {
                  parent.insertBefore(frag, node);
                }
              });
              parent.removeChild(node);
            }
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const children = Array.from(node.childNodes);
          children.forEach(walkAndRender);
        }
      };

      walkAndRender(rootRef.current);
    }
  }, [content]);

  return (
    <div 
      ref={rootRef} 
      className={`prose prose-blue max-w-none ${className}`}
    />
  );
};

export default MarkdownRenderer;
