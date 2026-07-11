export type AiProviderId = "mock" | "gemini" | "azure";

export interface AiChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiChatRequest {
  messages: AiChatMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface AiChatResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export interface AiEmbeddingRequest {
  input: string | string[];
}

export interface AiEmbeddingResponse {
  embeddings: number[][];
  model: string;
  usage?: {
    totalTokens: number;
  };
}

export interface AiProvider {
  readonly id: AiProviderId;
  chat(request: AiChatRequest): Promise<AiChatResponse>;
  embed(request: AiEmbeddingRequest): Promise<AiEmbeddingResponse>;
}
