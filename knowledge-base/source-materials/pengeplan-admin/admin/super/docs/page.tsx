'use client';

import React, { useState } from 'react';
import { Search, FileText, AlertCircle, Loader2, X } from 'lucide-react';

import AppShell from '@/components/layout/AppShell';
import { DocsViewer } from '@/components/DocsViewer';
import { PPEmpty } from '@/components/ui/PPEmpty';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// Utility function for class names
function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(' ')
}

import { useDocsIndex, useDocumentContent, useDocumentSearch } from './useDocsIndex';
import { DocsTree } from './DocsTree';

export default function AdminDocsPage() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { index, loading: indexLoading, error: indexError } = useDocsIndex();
  const { document, loading: docLoading, error: docError } = useDocumentContent(selectedPath);
  const { results, loading: searchLoading, search, clearSearch } = useDocumentSearch();

  const handleFileSelect = (path: string, title: string) => {
    setSelectedPath(path);
    setSelectedTitle(title);
    setShowSearchResults(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await search(query);
      setShowSearchResults(true);
    } else {
      clearSearch();
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (path: string, title: string) => {
    handleFileSelect(path, title);
  };

  const clearSearchAndResults = () => {
    setSearchQuery('');
    clearSearch();
    setShowSearchResults(false);
  };

  if (indexLoading) {
    return (
      <AppShell role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-pp-primary" />
            <span className="text-pp-muted">Laster dokumentasjon...</span>
          </div>
        </div>
      </AppShell>
    );
  }

  if (indexError) {
    return (
      <AppShell role="admin">
        <PPEmpty
          icon={<AlertCircle className="w-12 h-12" />}
          title="Kunne ikke laste dokumentasjon"
          description={indexError}
          action={{
            label: 'Prøv igjen',
            onClick: () => window.location.reload()
          }}
        />
      </AppShell>
    );
  }

  return (
    <AppShell role="admin">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-pp-border bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-pp-dark">Dokumentasjon</h1>
              <p className="text-sm text-pp-muted mt-1">
                Prosjektdokumentasjon og endringslogg
              </p>
            </div>
            
            {/* Search */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pp-muted" />
                <Input
                  type="text"
                  placeholder="Søk i dokumentasjon..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-10 w-80"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearchAndResults}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pp-muted hover:text-pp-dark"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {searchLoading && (
                <Loader2 className="w-4 h-4 animate-spin text-pp-primary" />
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r border-pp-border bg-white overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-pp-dark mb-3 uppercase tracking-wider">
                Dokumenter
              </h2>
              
              {showSearchResults ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-pp-muted">
                      {results.length} resultater for &quot;{searchQuery}&quot;
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearchAndResults}
                      className="h-auto p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {results.length === 0 ? (
                    <p className="text-sm text-pp-muted italic">
                      Ingen resultater funnet
                    </p>
                  ) : (
                    results.map((result) => (
                      <button
                        key={result.path}
                        onClick={() => handleSearchResultClick(result.path, result.title)}
                        className={cn(
                          'w-full text-left p-3 rounded-lg border border-pp-border',
                          'hover:bg-pp-light/50 transition-colors',
                          'focus:outline-none focus:ring-2 focus:ring-pp-primary/20',
                          selectedPath === result.path && 'bg-pp-primary/10 border-pp-primary'
                        )}
                      >
                        <div className="text-sm font-medium text-pp-dark mb-1">
                          {result.title}
                        </div>
                        <div className="text-xs text-pp-muted line-clamp-2">
                          {result.excerpt}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <DocsTree
                  files={index?.files || []}
                  selectedPath={selectedPath}
                  onFileSelect={handleFileSelect}
                />
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-6">
              {docLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-pp-primary" />
                    <span className="text-pp-muted">Laster dokument...</span>
                  </div>
                </div>
              ) : docError ? (
                <PPEmpty
                  icon={<AlertCircle className="w-8 h-8" />}
                  title="Kunne ikke laste dokument"
                  description={docError}
                  variant="compact"
                />
              ) : document ? (
                <DocsViewer
                  content={document.content}
                  title={document.title}
                  {...(document.lastUpdated && { lastUpdated: document.lastUpdated })}
                  breadcrumbs={[
                    { label: 'Dokumentasjon' },
                    { label: selectedTitle }
                  ]}
                />
              ) : (
                <PPEmpty
                  icon={<FileText className="w-12 h-12" />}
                  title="Velg et dokument"
                  description="Velg et dokument fra listen til venstre for å vise innholdet her."
                  variant="compact"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}