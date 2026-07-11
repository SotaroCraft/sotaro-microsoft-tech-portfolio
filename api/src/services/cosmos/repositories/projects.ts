import { randomUUID } from "node:crypto";
import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from "@microstar/shared";
import { projectSchema } from "@microstar/shared";
import { getCosmosContainer } from "../client";
import { COSMOS_CONTAINERS } from "../containers";

async function projectsContainer() {
  return getCosmosContainer(COSMOS_CONTAINERS.projects);
}

export async function listProjects(userId: string): Promise<Project[]> {
  const container = await projectsContainer();
  const { resources } = await container.items
    .query<Project>({
      query:
        "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.updatedAt DESC",
      parameters: [{ name: "@userId", value: userId }],
    })
    .fetchAll();

  return resources.map((row) => projectSchema.parse(row));
}

export async function getProject(
  userId: string,
  id: string,
): Promise<Project | null> {
  const container = await projectsContainer();
  try {
    const { resource } = await container.item(id, userId).read<Project>();
    return resource ? projectSchema.parse(resource) : null;
  } catch {
    return null;
  }
}

export async function createProject(
  userId: string,
  input: CreateProjectInput,
): Promise<Project> {
  const container = await projectsContainer();
  const now = new Date().toISOString();
  const project = projectSchema.parse({
    id: randomUUID(),
    userId,
    title: input.title.trim(),
    summary: input.summary?.trim() || undefined,
    status: "active",
    lastOpenedAt: now,
    createdAt: now,
    updatedAt: now,
  });

  await container.items.create(project);
  return project;
}

export async function updateProject(
  userId: string,
  id: string,
  input: UpdateProjectInput,
): Promise<Project | null> {
  const existing = await getProject(userId, id);
  if (!existing) return null;

  const container = await projectsContainer();
  const updated = projectSchema.parse({
    ...existing,
    ...input,
    title: input.title?.trim() ?? existing.title,
    summary:
      input.summary !== undefined
        ? input.summary.trim() || undefined
        : existing.summary,
    updatedAt: new Date().toISOString(),
  });

  await container.item(id, userId).replace(updated);
  return updated;
}

export async function touchProjectOpened(
  userId: string,
  id: string,
): Promise<Project | null> {
  return updateProject(userId, id, {
    lastOpenedAt: new Date().toISOString(),
  });
}

export async function deleteProject(
  userId: string,
  id: string,
): Promise<boolean> {
  const container = await projectsContainer();
  try {
    await container.item(id, userId).delete();
    return true;
  } catch {
    return false;
  }
}
