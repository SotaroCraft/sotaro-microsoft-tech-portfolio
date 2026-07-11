import {
  type AccountInfo,
  type IPublicClientApplication,
  InteractionRequiredAuthError,
  PublicClientApplication,
} from "@azure/msal-browser";
import {
  buildMsalConfig,
  graphTokenRequest,
  useGraphMock,
} from "../msalConfig";

let pca: IPublicClientApplication | null = null;
let initPromise: Promise<IPublicClientApplication | null> | null = null;

export async function getMsalInstance(): Promise<IPublicClientApplication | null> {
  if (useGraphMock()) return null;
  if (pca) return pca;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const config = buildMsalConfig();
    if (!config) return null;
    const instance = new PublicClientApplication(config);
    await instance.initialize();
    await instance.handleRedirectPromise().catch(() => null);
    pca = instance;
    return instance;
  })();

  return initPromise;
}

function pickAccount(instance: IPublicClientApplication): AccountInfo | null {
  const active = instance.getActiveAccount();
  if (active) return active;
  const accounts = instance.getAllAccounts();
  if (accounts.length > 0) {
    instance.setActiveAccount(accounts[0]);
    return accounts[0];
  }
  return null;
}

/** Acquire a Graph access token via silent → popup. */
export async function acquireGraphAccessToken(): Promise<string> {
  if (useGraphMock()) {
    throw new Error("Graph mock mode is enabled; no live token.");
  }

  const instance = await getMsalInstance();
  if (!instance) {
    throw new Error(
      "MSAL is not configured. Set VITE_ENTRA_CLIENT_ID or enable VITE_GRAPH_USE_MOCK=true.",
    );
  }

  let account = pickAccount(instance);
  if (!account) {
    const login = await instance.loginPopup(graphTokenRequest);
    account = login.account;
    if (account) instance.setActiveAccount(account);
  }

  if (!account) {
    throw new Error("Sign-in required for Microsoft Graph.");
  }

  try {
    const result = await instance.acquireTokenSilent({
      ...graphTokenRequest,
      account,
    });
    return result.accessToken;
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      const result = await instance.acquireTokenPopup(graphTokenRequest);
      return result.accessToken;
    }
    throw err;
  }
}
