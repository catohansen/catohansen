'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FileText } from 'lucide-react';

// Utility function for class names
function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(' ')
}

interface DocFile {
  path: string;
  name: string;
  title: string;
  type: 'file' | 'directory';
  children?: DocFile[];
}

interface DocsTreeProps {
  files: DocFile[];
  selectedPath?: string | null;
  onFileSelect: (path: string, title: string) => void;
  className?: string;
}

interface TreeNodeProps {
  file: DocFile;
  level: number;
  selectedPath?: string | null;
  onFileSelect: (path: string, title: string) => void;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
}

function TreeNode({ 
  file, 
  level, 
  selectedPath, 
  onFileSelect, 
  expandedFolders, 
  onToggleFolder 
}: TreeNodeProps) {
  const isExpanded = expandedFolders.has(file.path);
  const isSelected = selectedPath === file.path;
  const paddingLeft = level * 16 + 8;

  const handleClick = () => {
    if (file.type === 'directory') {
      onToggleFolder(file.path);
    } else {
      onFileSelect(file.path, file.title);
    }
  };

  const getIcon = () => {
    if (file.type === 'directory') {
      return isExpanded ? (
        <ChevronDown className="w-4 h-4 text-pp-muted" />
      ) : (
        <ChevronRight className="w-4 h-4 text-pp-muted" />
      );
    }
    
    if (file.name === 'CHANGELOG.md') {
      return <FileText className="w-4 h-4 text-blue-500" />;
    }
    
    return <File className="w-4 h-4 text-pp-muted" />;
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(
          'w-full flex items-center gap-2 py-2 px-2 text-left text-sm',
          'hover:bg-pp-light/50 rounded transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-pp-primary/20',
          isSelected && `bg-pp-primary/10 text-pp-primary font-medium`,
          !isSelected && 'text-pp-dark'
        )}
        style={{ paddingLeft }}
        aria-expanded={file.type === 'directory' ? isExpanded : undefined}
        aria-label={file.type === 'directory' ? `Toggle ${file.title} folder` : `Open ${file.title}`}
      >
        {getIcon()}
        <span className="truncate" title={file.title}>
          {file.title}
        </span>
      </button>

      {file.type === 'directory' && isExpanded && file.children && (
        <div role="group" aria-label={`${file.title} contents`}>
          {file.children.map((child) => (
            <TreeNode
              key={child.path}
              file={child}
              level={level + 1}
              selectedPath={selectedPath || null}
              onFileSelect={onFileSelect}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function DocsTree({ files, selectedPath, onFileSelect, className }: DocsTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['project/docs']) // Expand docs folder by default
  );

  const handleToggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  if (!files || files.length === 0) {
    return (
      <div className={cn('p-4 text-center text-pp-muted', className)}>
        <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Ingen dokumenter funnet</p>
      </div>
    );
  }

  return (
    <nav 
      className={cn('docs-tree', className)}
      aria-label="Documentation navigation"
    >
      <div className="space-y-1">
        {files.map((file) => (
          <TreeNode
            key={file.path}
            file={file}
            level={0}
            selectedPath={selectedPath || null}
            onFileSelect={onFileSelect}
            expandedFolders={expandedFolders}
            onToggleFolder={handleToggleFolder}
          />
        ))}
      </div>
    </nav>
  );
}