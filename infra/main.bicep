targetScope = 'subscription'

@description('Azure region for all resources')
param location string = 'japaneast'

@description('Resource group name')
param resourceGroupName string = 'rg-microbootcan-prod'

@description('Base name for resources (lowercase, no hyphens for some services)')
param baseName string = 'microbootcan'

@description('Tags applied to all resources')
param tags object = {
  project: 'MicroStarPlatform'
  env: 'prod'
  managedBy: 'bicep'
}

@description('AI provider for Functions (mock | gemini | azure)')
param aiProvider string = 'mock'

@description('Gemini API key — leave empty in Bicep; set via portal or GitHub secret')
@secure()
param geminiApiKey string = ''

@description('Azure OpenAI endpoint (optional until Phase F)')
param azureOpenAiEndpoint string = ''

@description('Azure OpenAI API key (optional until Phase F)')
@secure()
param azureOpenAiApiKey string = ''

@description('Static Web Apps region (not available in japaneast)')
param staticSiteLocation string = 'eastasia'

// Resource Group
resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

// Deploy resources into the resource group
module resources 'modules/resources.bicep' = {
  name: 'microbootcan-resources'
  scope: rg
  params: {
    location: location
    baseName: baseName
    tags: tags
    aiProvider: aiProvider
    geminiApiKey: geminiApiKey
    azureOpenAiEndpoint: azureOpenAiEndpoint
    azureOpenAiApiKey: azureOpenAiApiKey
    staticSiteLocation: staticSiteLocation
  }
}

output resourceGroupName string = rg.name
output cosmosAccountName string = resources.outputs.cosmosAccountName
output cosmosEndpoint string = resources.outputs.cosmosEndpoint
output appInsightsConnectionString string = resources.outputs.appInsightsConnectionString
output appInsightsInstrumentationKey string = resources.outputs.appInsightsInstrumentationKey
output staticSiteName string = resources.outputs.staticSiteName
output staticSiteDefaultHostname string = resources.outputs.staticSiteDefaultHostname
