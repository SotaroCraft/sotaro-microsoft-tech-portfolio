import { randomUUID } from "node:crypto";
import type {
  CreateEpisodeInput,
  Episode,
  UpdateEpisodeInput,
} from "@microbootcan/shared";
import { episodeSchema } from "@microbootcan/shared";
import { getCosmosContainer } from "../client";
import { COSMOS_CONTAINERS } from "../containers";

export async function listEpisodes(userId: string): Promise<Episode[]> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.episodes);
  const { resources } = await container.items
    .query<Episode>({
      query: "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.updatedAt DESC",
      parameters: [{ name: "@userId", value: userId }],
    })
    .fetchAll();

  return resources.map((row) => episodeSchema.parse(row));
}

export async function getEpisode(
  userId: string,
  id: string,
): Promise<Episode | null> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.episodes);
  try {
    const { resource } = await container.item(id, userId).read<Episode>();
    return resource ? episodeSchema.parse(resource) : null;
  } catch {
    return null;
  }
}

export async function createEpisode(
  userId: string,
  input: CreateEpisodeInput,
): Promise<Episode> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.episodes);
  const now = new Date().toISOString();
  const episode: Episode = episodeSchema.parse({
    ...input,
    id: randomUUID(),
    userId,
    createdAt: now,
    updatedAt: now,
  });

  await container.items.create(episode);
  return episode;
}

export async function updateEpisode(
  userId: string,
  id: string,
  input: UpdateEpisodeInput,
): Promise<Episode | null> {
  const existing = await getEpisode(userId, id);
  if (!existing) {
    return null;
  }

  const container = await getCosmosContainer(COSMOS_CONTAINERS.episodes);
  const updated: Episode = episodeSchema.parse({
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  });

  await container.item(id, userId).replace(updated);
  return updated;
}

export async function deleteEpisode(
  userId: string,
  id: string,
): Promise<boolean> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.episodes);
  try {
    await container.item(id, userId).delete();
    return true;
  } catch {
    return false;
  }
}
