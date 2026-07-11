targetScope = 'subscription'

@description('Azure region for all resources')
param location string = 'japaneast'

@description('Resource group name')
param resourceGroupName string = 'rg-microbootcan-prod'

@description('Base name for resources (lowercase, no hyphens for some services)')
param baseName string = 'microbootcan'

@description('Tags applied to all resources')
param tags object = {
  project: 'MicroBootCan'
  env: 'prod'
  managedBy: 'bicep'
}

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
  }
}

output resourceGroupName string = rg.name
output cosmosAccountName string = resources.outputs.cosmosAccountName
output cosmosEndpoint string = resources.outputs.cosmosEndpoint
output appInsightsConnectionString string = resources.outputs.appInsightsConnectionString
output appInsightsInstrumentationKey string = resources.outputs.appInsightsInstrumentationKey
