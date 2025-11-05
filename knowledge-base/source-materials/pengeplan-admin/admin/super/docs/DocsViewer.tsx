'use client';

import { useEffect, useRef } from 'react';

interface DocsViewerProps {
  content: string;
}

export default function DocsViewer({ content }: DocsViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      renderMarkdown(content, contentRef.current);
    }
  }, [content]);

  const renderMarkdown = (markdown: string, container: HTMLElement) => {
    // Simple markdown parser for basic elements
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-6">$1</h1>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'text';
        return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="language-${language}">${escapeHtml(code.trim())}</code></pre>`;
      })
      
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Lists
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4">$1. $2</li>')
      
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
      
      // Line breaks
      .replace(/\n/g, '<br>');

    // Wrap in paragraph tags
    html = `<p class="mb-4 text-gray-700 leading-relaxed">${html}</p>`;

    // Process lists
    html = html
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc space-y-1 mb-4">$1</ul>')
      .replace(/(<li.*<\/li>)/g, '<ol class="list-decimal space-y-1 mb-4">$1</ol>');

    // Process tables
    html = processTables(html);

    // Process special blocks
    html = processSpecialBlocks(html);

    container.innerHTML = html;

    // Process mermaid diagrams
    processMermaidBlocks(container);
  };

  const processTables = (html: string): string => {
    const tableRegex = /\|(.+)\|\n\|([-|]+)\|\n((?:\|.+\|\n?)+)/g;
    
    return html.replace(tableRegex, (match, headers, separator, rows) => {
      const headerCells = headers.split('|').map((h: string) => h.trim()).filter(Boolean);
      const rowLines = rows.trim().split('\n');
      
      let tableHtml = '<div class="overflow-x-auto my-6"><table class="min-w-full border border-gray-200 rounded-lg">';
      
      // Headers
      tableHtml += '<thead class="bg-gray-50"><tr>';
      headerCells.forEach((header: string) => {
        tableHtml += `<th class="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">${header}</th>`;
      });
      tableHtml += '</tr></thead>';
      
      // Rows
      tableHtml += '<tbody class="bg-white">';
      rowLines.forEach((row: string) => {
        const cells = row.split('|').map((c: string) => c.trim()).filter(Boolean);
        tableHtml += '<tr>';
        cells.forEach((cell: string) => {
          tableHtml += `<td class="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">${cell}</td>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</tbody></table></div>';
      
      return tableHtml;
    });
  };

  const processSpecialBlocks = (html: string): string => {
    // Info blocks
    html = html.replace(
      /^> 💡 (.*$)/gim,
      '<div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded-r-lg"><div class="flex"><div class="flex-shrink-0"><Info className="h-5 w-5 text-blue-400" /></div><div class="ml-3"><p class="text-sm text-blue-700">$1</p></div></div></div>'
    );

    // Warning blocks
    html = html.replace(
      /^> ⚠️ (.*$)/gim,
      '<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4 rounded-r-lg"><div class="flex"><div class="flex-shrink-0"><AlertTriangle className="h-5 w-5 text-yellow-400" /></div><div class="ml-3"><p class="text-sm text-yellow-700">$1</p></div></div></div>'
    );

    // Success blocks
    html = html.replace(
      /^> ✅ (.*$)/gim,
      '<div class="bg-green-50 border-l-4 border-green-400 p-4 my-4 rounded-r-lg"><div class="flex"><div class="flex-shrink-0"><CheckCircle className="h-5 w-5 text-green-400" /></div><div class="ml-3"><p class="text-sm text-green-700">$1</p></div></div></div>'
    );

    return html;
  };

  const processMermaidBlocks = (container: HTMLElement) => {
    const mermaidBlocks = container.querySelectorAll('pre code.language-mermaid');
    
    mermaidBlocks.forEach((block) => {
      const mermaidCode = block.textContent || '';
      const mermaidDiv = document.createElement('div');
      mermaidDiv.className = 'bg-gray-50 p-4 rounded-lg my-4 border';
      mermaidDiv.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Mermaid Diagram</span>
          <Badge variant="outline">Diagram</Badge>
        </div>
        <pre class="text-xs text-gray-600 overflow-x-auto"><code>${escapeHtml(mermaidCode)}</code></pre>
        <p class="text-xs text-gray-500 mt-2">Mermaid diagram - vises som kode hvis mermaid ikke er aktivert</p>
      `;
      
      block.parentElement?.replaceWith(mermaidDiv);
    });
  };

  const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  return (
    <div className="prose prose-gray max-w-none">
      <div ref={contentRef} className="markdown-content"></div>
    </div>
  );
}
