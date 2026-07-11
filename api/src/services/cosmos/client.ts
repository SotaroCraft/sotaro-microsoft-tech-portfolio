import { CosmosClient, type Database, type Container } from "@azure/cosmos";

let client: CosmosClient | undefined;
let database: Database | undefined;

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

export async function getCosmosDatabase(): Promise<Database> {
  if (!database) {
    const { databaseId } = readCosmosConfig();
    database = getCosmosClient().database(databaseId);
  }
  return database;
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
