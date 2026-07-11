import type { MatchRequest, MatchResponse } from "@microstar/shared";
import { getAiProvider } from "./index";
import { listEpisodes } from "../cosmos/repositories/episodes";

function cosineSimilarity(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length);
  if (length === 0) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < length; i++) {
    dot += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function excerpt(text: string, max = 160): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max - 1)}…`;
}

export async function runContextMatch(
  userId: string,
  request: MatchRequest,
): Promise<MatchResponse> {
  const provider = getAiProvider();
  const episodes = await listEpisodes(userId);

  const referenceEmbedding = (
    await provider.embed({ input: request.referenceText })
  ).embeddings[0];

  if (!referenceEmbedding) {
    return { results: [], provider: provider.id };
  }

  const scored = await Promise.all(
    episodes.map(async (episode) => {
      const source = [
        episode.title,
        episode.bodyText,
        episode.situation,
        episode.task,
        episode.action,
        episode.result,
      ]
        .filter(Boolean)
        .join("\n");

      const embedding = (await provider.embed({ input: source })).embeddings[0] ??
        [];
      const score = cosineSimilarity(referenceEmbedding, embedding);

      return {
        episodeId: episode.id,
        title: episode.title,
        score,
        excerpt: excerpt(source),
      };
    }),
  );

  const results = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, request.topK);

  let draftSummary: string | undefined;
  if (results.length > 0) {
    const chat = await provider.chat({
      messages: [
        {
          role: "system",
          content:
            "You summarize how reference text relates to achievement journal entries. Use neutral professional language.",
        },
        {
          role: "user",
          content: `Reference:\n${request.referenceText.slice(0, 2000)}\n\nTop matches:\n${results
            .map((row) => `- ${row.title}: ${row.excerpt}`)
            .join("\n")}`,
        },
      ],
      maxTokens: 400,
      temperature: 0.3,
    });
    draftSummary = chat.content;
  }

  return {
    results,
    draftSummary,
    provider: provider.id,
  };
}
