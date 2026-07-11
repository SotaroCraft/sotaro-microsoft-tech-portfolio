import { randomUUID } from "node:crypto";
import type {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "@microstar/shared";
import { applicationSchema } from "@microstar/shared";
import { getCosmosContainer } from "../client";
import { COSMOS_CONTAINERS } from "../containers";

export async function listApplications(userId: string): Promise<Application[]> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.applications);
  const { resources } = await container.items
    .query<Application>({
      query:
        "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.stageUpdatedAt DESC",
      parameters: [{ name: "@userId", value: userId }],
    })
    .fetchAll();

  return resources.map((row) => applicationSchema.parse(row));
}

export async function createApplication(
  userId: string,
  input: CreateApplicationInput,
): Promise<Application> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.applications);
  const application: Application = applicationSchema.parse({
    ...input,
    id: randomUUID(),
    userId,
    stageUpdatedAt: new Date().toISOString(),
  });

  await container.items.create(application);
  return application;
}

export async function updateApplication(
  userId: string,
  id: string,
  input: UpdateApplicationInput,
): Promise<Application | null> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.applications);
  try {
    const { resource } = await container.item(id, userId).read<Application>();
    if (!resource) {
      return null;
    }

    const stageChanged =
      input.stage !== undefined && input.stage !== resource.stage;

    const updated = applicationSchema.parse({
      ...resource,
      ...input,
      stageUpdatedAt: stageChanged
        ? new Date().toISOString()
        : resource.stageUpdatedAt,
    });
    await container.item(id, userId).replace(updated);
    return updated;
  } catch {
    return null;
  }
}

/** @deprecated Prefer updateApplication */
export async function updateApplicationStage(
  userId: string,
  id: string,
  stage: string,
): Promise<Application | null> {
  return updateApplication(userId, id, { stage });
}

export async function deleteApplication(
  userId: string,
  id: string,
): Promise<boolean> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.applications);
  try {
    await container.item(id, userId).delete();
    return true;
  } catch {
    return false;
  }
}
