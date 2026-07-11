import { CosmosClient, type Database, type Container } from "@azure/cosmos";
import { COSMOS_CONTAINERS } from "./containers";

let client: CosmosClient | undefined;
let database: Database | undefined;
let ensured = false;

const containerCache = new Map<string, Container>();

function readCosmosConfig() {
  const endpoint = process.env.COSMOS_ENDPOINT;
  const key = process.env.COSMOS_KEY;
  const databaseId = process.env.COSMOS_DATABASE ?? "microbootcan";

  if (!endpoint || !key) {
    throw new Error(
      "Cosmos DB is not configured. Set COSMOS_ENDPOINT and COSMOS_KEY.",
    );
  }

  return { endpoint, key, databaseId };
}

export function getCosmosClient(): CosmosClient {
  if (!client) {
    const { endpoint, key } = readCosmosConfig();
    client = new CosmosClient({ endpoint, key });
  }
  return client;
}

/** Create database + all containers (same set as Bicep) on first use — local emulator parity. */
export async function ensureCosmosReady(): Promise<Database> {
  if (ensured && database) {
    return database;
  }

  const { databaseId } = readCosmosConfig();
  const { database: db } = await getCosmosClient().databases.createIfNotExists({
    id: databaseId,
  });

  for (const name of Object.values(COSMOS_CONTAINERS)) {
    await db.containers.createIfNotExists({
      id: name,
      partitionKey: { paths: ["/userId"] },
    });
  }

  database = db;
  ensured = true;
  return db;
}

export async function getCosmosDatabase(): Promise<Database> {
  return ensureCosmosReady();
}

export async function getCosmosContainer(name: string): Promise<Container> {
  const cached = containerCache.get(name);
  if (cached) {
    return cached;
  }

  const db = await getCosmosDatabase();
  const container = db.container(name);
  containerCache.set(name, container);
  return container;
}
