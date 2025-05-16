import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { LoggerService } from './logger';

const logger = new LoggerService('Swagger');

export const setupSwagger = (app: Application) => {
  const options: swaggerJSDoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Express API',
        version: '1.0.0',
        description: 'API Documentation',
      },
      servers: [
        {
          url: `/api/v1`,
          description: 'API Server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['src/resources/**/*.ts'],
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: false,
      customCss: '.swagger-ui .topbar { display: none }',
    })
  );

  app.get('/docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  logger.info('📚 Swagger docs available at /docs');
  logger.info('📄 Swagger JSON available at /docs-json');
};
