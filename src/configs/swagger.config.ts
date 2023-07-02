import swaggerJSDoc, { Options } from 'swagger-jsdoc'

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swagger API',
      version: '1.0.0',
      description: 'Kahoot APIs'
    },
    servers: [
      {
        url: 'http://localhost:5000'
      }
    ]
  },
  apis: [
    `${__dirname}/../swagger/*.yaml`,
    `${__dirname}/../swagger/**/*.yaml`,
    `${__dirname}/../src/swagger/*.yaml`, // FOR NPM WEBPACK (DEBUG MODE)
    `${__dirname}/../src/swagger/**/*.yaml` // FOR NPM WEBPACK (DEBUG MODE)
  ]
}

const swaggerDocs = swaggerJSDoc(swaggerOptions)

export { swaggerOptions, swaggerDocs }
