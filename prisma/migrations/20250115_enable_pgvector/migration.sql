-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add vector column for embeddings (1536 dimensions for text-embedding-3-small)
ALTER TABLE "KnowledgeChunk"
  ADD COLUMN IF NOT EXISTS "embedding_vec" vector(1536);

-- Create index for efficient vector similarity search
CREATE INDEX IF NOT EXISTS "KnowledgeChunk_embedding_vec_idx" 
ON "KnowledgeChunk" 
USING ivfflat (embedding_vec vector_cosine_ops)
WITH (lists = 100);

-- Comment: This index uses ivfflat for approximate nearest neighbor search
-- Lists parameter (100) is a good default; adjust based on your data size



