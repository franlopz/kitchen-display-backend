import config from '../config'

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Kitchen Display API',
      version: '1.0.0',
      description: 'This is the API documentation'
    },
    basePath: '/',
    servers: [{ url: `http://localhost:${config.PORT ?? 3000}` }],
    components: {
      securitySchemes: {
        BasicAuth: {
          type: 'http',
          scheme: 'basic'
        }
      }
    },
    security: [
      {
        BasicAuth: []
      }
    ]
  },
  apis: ['./swagger-docs/*.yaml']
}

export default swaggerOptions
