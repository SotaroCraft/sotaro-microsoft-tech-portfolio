import type {
  CareerSummary,
  UpdateCareerSummaryInput,
} from "@microbootcan/shared";
import { careerSummarySchema } from "@microbootcan/shared";
import { getCosmosContainer } from "../client";
import { COSMOS_CONTAINERS } from "../containers";

const SUMMARY_DOC_ID = "summary";

export async function getCareerSummary(
  userId: string,
): Promise<CareerSummary | null> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.career);
  try {
    const { resource } = await container
      .item(SUMMARY_DOC_ID, userId)
      .read<CareerSummary>();
    return resource ? careerSummarySchema.parse(resource) : null;
  } catch {
    return null;
  }
}

export async function upsertCareerSummary(
  userId: string,
  input: UpdateCareerSummaryInput,
): Promise<CareerSummary> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.career);
  const existing = await getCareerSummary(userId);
  const summary: CareerSummary = careerSummarySchema.parse({
    id: SUMMARY_DOC_ID,
    userId,
    summaryJa: input.summaryJa ?? existing?.summaryJa ?? "",
    summaryEn: input.summaryEn ?? existing?.summaryEn ?? "",
    metrics: input.metrics ?? existing?.metrics ?? [],
    updatedAt: new Date().toISOString(),
  });

  await container.items.upsert(summary);
  return summary;
}
