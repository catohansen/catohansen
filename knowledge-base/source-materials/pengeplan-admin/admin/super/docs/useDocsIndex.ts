'use client';

import { useState, useEffect } from 'react';

interface DocFile {
  path: string;
  name: string;
  title: string;
  content: string;
  frontmatter: Record<string, any>;
  lastUpdated?: string;
  type: 'file' | 'directory';
  children?: DocFile[];
}

interface DocsIndex {
  files: DocFile[];
  totalFiles: number;
}

interface SearchResult {
  path: string;
  title: string;
  excerpt: string;
  score: number;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  totalResults: number;
}

export function useDocsIndex() {
  const [index, setIndex] = useState<DocsIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIndex = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/docs/index');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setIndex(data);
    } catch (err) {
      console.error('Error loading docs index:', err);
      setError(err instanceof Error ? err.message : 'Failed to load docs index');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIndex();
  }, []);

  return {
    index,
    loading,
    error,
    reload: loadIndex
  };
}

export function useDocumentContent(path: string | null) {
  const [document, setDocument] = useState<DocFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!path) {
      setDocument(null);
      return;
    }

    const loadDocument = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/admin/docs/content?path=${encodeURIComponent(path)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setDocument(data);
      } catch (err) {
        console.error('Error loading document:', err);
        setError(err instanceof Error ? err.message : 'Failed to load document');
        setDocument(null);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [path]);

  return {
    document,
    loading,
    error
  };
}

export function useDocumentSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const search = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setQuery('');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setQuery(searchQuery);
      
      const response = await fetch(`/api/admin/docs/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: SearchResponse = await response.json();
      setResults(data.results);
    } catch (err) {
      console.error('Error searching documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to search documents');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setResults([]);
    setQuery('');
    setError(null);
  };

  return {
    results,
    loading,
    error,
    query,
    search,
    clearSearch
  };
}