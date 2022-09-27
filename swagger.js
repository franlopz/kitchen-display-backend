const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output_setup.json'
const endpointsFiles = ['./src/routes/.routes.ts']

swaggerAutogen(outputFile, endpointsFiles)
