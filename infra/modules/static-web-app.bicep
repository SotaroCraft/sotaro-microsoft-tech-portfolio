@description('Azure region')
param location string

@description('Static Web App name (globally unique)')
param staticSiteName string

@description('Resource tags')
param tags object

@description('Cosmos DB document endpoint')
param cosmosEndpoint string

@description('Cosmos DB primary key')
@secure()
param cosmosKey string

@description('Cosmos database name')
param cosmosDatabase string = 'microbootcan'

@description('Application Insights connection string')
param appInsightsConnectionString string

@description('AI provider: mock | gemini | azure')
param aiProvider string = 'mock'

@description('Gemini API key placeholder — set via GitHub secret / portal after deploy')
@secure()
param geminiApiKey string = ''

@description('Azure OpenAI endpoint placeholder')
param azureOpenAiEndpoint string = ''

@description('Azure OpenAI API key placeholder')
@secure()
param azureOpenAiApiKey string = ''

@description('Application environment label')
param appEnv string = 'prod'

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: staticSiteName
  location: location
  tags: tags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

resource swaAppSettings 'Microsoft.Web/staticSites/config@2023-12-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    APP_ENV: appEnv
    COSMOS_ENDPOINT: cosmosEndpoint
    COSMOS_KEY: cosmosKey
    COSMOS_DATABASE: cosmosDatabase
    APPLICATIONINSIGHTS_CONNECTION_STRING: appInsightsConnectionString
    AI_PROVIDER: aiProvider
    GEMINI_API_KEY: geminiApiKey
    AZURE_OPENAI_ENDPOINT: azureOpenAiEndpoint
    AZURE_OPENAI_API_KEY: azureOpenAiApiKey
    AZURE_OPENAI_CHAT_DEPLOYMENT: 'gpt-5-mini'
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT: 'text-embedding-3-small'
  }
}

output staticSiteName string = staticWebApp.name
output staticSiteDefaultHostname string = staticWebApp.properties.defaultHostname
output staticSiteId string = staticWebApp.id
