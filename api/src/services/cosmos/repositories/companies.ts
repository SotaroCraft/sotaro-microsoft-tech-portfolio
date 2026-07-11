import { randomUUID } from "node:crypto";
import type {
  Company,
  CreateCompanyInput,
  UpdateCompanyInput,
} from "@microbootcan/shared";
import { companySchema } from "@microbootcan/shared";
import { getCosmosContainer } from "../client";
import { COSMOS_CONTAINERS } from "../containers";

export async function listCompanies(userId: string): Promise<Company[]> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.companies);
  const { resources } = await container.items
    .query<Company>({
      query: "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.priority ASC",
      parameters: [{ name: "@userId", value: userId }],
    })
    .fetchAll();

  return resources.map((row) => companySchema.parse(row));
}

export async function createCompany(
  userId: string,
  input: CreateCompanyInput,
): Promise<Company> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.companies);
  const company: Company = companySchema.parse({
    ...input,
    id: randomUUID(),
    userId,
  });

  await container.items.create(company);
  return company;
}

export async function updateCompany(
  userId: string,
  id: string,
  input: UpdateCompanyInput,
): Promise<Company | null> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.companies);
  try {
    const { resource } = await container.item(id, userId).read<Company>();
    if (!resource) {
      return null;
    }

    const updated = companySchema.parse({
      ...resource,
      ...input,
    });
    await container.item(id, userId).replace(updated);
    return updated;
  } catch {
    return null;
  }
}

export async function deleteCompany(
  userId: string,
  id: string,
): Promise<boolean> {
  const container = await getCosmosContainer(COSMOS_CONTAINERS.companies);
  try {
    await container.item(id, userId).delete();
    return true;
  } catch {
    return false;
  }
}
