import type {
  AiChatRequest,
  AiChatResponse,
  AiEmbeddingRequest,
  AiEmbeddingResponse,
  AiProvider,
} from "./types";

const MOCK_EMBEDDING_DIM = 1536;

function deterministicVector(text: string): number[] {
  const vector = new Array<number>(MOCK_EMBEDDING_DIM);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  for (let i = 0; i < MOCK_EMBEDDING_DIM; i++) {
    hash = (hash * 1664525 + 1013904223 + i) >>> 0;
    vector[i] = (hash / 0xffffffff) * 2 - 1;
  }
  return vector;
}

export class MockAiProvider implements AiProvider {
  readonly id = "mock" as const;

  async chat(request: AiChatRequest): Promise<AiChatResponse> {
    const lastUser = [...request.messages].reverse().find((m) => m.role === "user");
    return {
      content: `[mock] Context match draft for: ${lastUser?.content.slice(0, 80) ?? "(empty)"}`,
      model: "mock-gpt",
      usage: { promptTokens: 0, completionTokens: 0 },
    };
  }

  async embed(request: AiEmbeddingRequest): Promise<AiEmbeddingResponse> {
    const inputs = Array.isArray(request.input) ? request.input : [request.input];
    return {
      embeddings: inputs.map(deterministicVector),
      model: "mock-embedding",
      usage: { totalTokens: 0 },
    };
  }
}
