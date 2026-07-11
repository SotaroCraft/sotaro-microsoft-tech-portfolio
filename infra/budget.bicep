targetScope = 'subscription'

@description('Budget name')
param budgetName string = 'MicroBootCan-Monthly'

@description('Monthly budget amount in billing currency')
param amount int = 2900

@description('Contact emails for budget alerts')
param contactEmails array = []

@description('Budget start date (YYYY-MM-DD)')
param startDate string = '2026-07-01'

@description('Budget end date (YYYY-MM-DD)')
param endDate string = '2030-12-31'

resource budget 'Microsoft.Consumption/budgets@2023-11-01' = {
  name: budgetName
  properties: {
    category: 'Cost'
    amount: amount
    timeGrain: 'Monthly'
    timePeriod: {
      startDate: startDate
      endDate: endDate
    }
    notifications: {
      Actual_GreaterThan_80_Percent: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 80
        thresholdType: 'Actual'
        contactEmails: contactEmails
        contactRoles: [
          'Owner'
        ]
      }
      Forecasted_GreaterThan_100_Percent: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 100
        thresholdType: 'Forecasted'
        contactEmails: contactEmails
        contactRoles: [
          'Owner'
        ]
      }
    }
  }
}

output budgetName string = budget.name
