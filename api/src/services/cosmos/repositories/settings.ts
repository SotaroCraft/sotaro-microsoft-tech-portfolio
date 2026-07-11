import { MILESTONE_TARGET_ISO, type UserSettings } from "@microstar/shared";
import { userSettingsSchema } from "@microstar/shared";
import { getCosmosContainer } from "../client";
import { COSMOS_CONTAINERS } from "../containers";

export async function getUserSettings(userId: string): Promise<UserSettings> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.settings);
  try {
    const { resource } = await container.item(userId, userId).read<UserSettings>();
    if (resource) {
      return userSettingsSchema.parse(resource);
    }
  } catch {
    // fall through to default
  }

  return userSettingsSchema.parse({
    id: userId,
    userId,
    milestoneTargetIso: MILESTONE_TARGET_ISO,
    updatedAt: new Date().toISOString(),
  });
}

export async function updateMilestoneTarget(
  userId: string,
  milestoneTargetIso: string,
): Promise<UserSettings> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.settings);
  const settings: UserSettings = userSettingsSchema.parse({
    id: userId,
    userId,
    milestoneTargetIso,
    updatedAt: new Date().toISOString(),
  });

  await container.items.upsert(settings);
  return settings;
}
