export const environment = {
  prouction: false,
  azure: {
    tenantId: '38dc443b-4fc6-443e-bc67-2c4a90f59d12',
    spaClientId: '7212afe9-1fb8-407c-be8b-d5351d0176cc',
    redirectUri: 'http://localhost:4200/login-callback',
    authority: 'https://login.microsoftonline.com/38dc443b-4fc6-443e-bc67-2c4a90f59d12',
    apis: {
      crm: {
        baseUrl: 'http://localhost:5000/api/crm',
        scopes: ['api://23632f49-90b8-4102-8496-e07ff10bdcb6/crm.readwrite'],
      },
    },
  },
};
