# tool-gateway
Backends



config Api GateWay



  {
    name: 'tool',
    path: '/tool',
    endpoints: [
      // Routes
      { method: 'GET', path: '/routes/all', handler: 'ConfigApi.listAllRoute' },
      { method: 'GET', path: '/routes/find', handler: 'ConfigApi.findbyNameRoute' },
      { method: 'DELETE', path: '/routes/:_idRoute', handler: 'ConfigApi.deleteRoute' },
      { method: 'PUT', path: '/routes/:_idRoute', handler: 'ConfigApi.updateRoute' },
      { method: 'POST', path: '/routes', handler: 'ConfigApi.addRoute' },
      // Endpoints
      { method: 'PUT', path: '/endpoints/:_idEndpoint', handler: 'ConfigApi.updateEndpoint' },
      { method: 'POST', path: '/endpoints', handler: 'ConfigApi.addEndpoint' },
      { method: 'DELETE', path: '/endpoints/:_idEndpoint', handler: 'ConfigApi.deleteEndpoint' },
      { method: 'GET', path: '/endpoints/all', handler: 'ConfigApi.listAllEndpoint' },
      { method: 'GET', path: '/endpoints/getconfig', handler: 'ConfigApi.sendEventConfig' },
    ],
  },
