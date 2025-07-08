// swagger.ts
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

export const swaggerDocs = (app: any) => {
  const swaggerDocument = YAML.load('./docs/swagger.yaml');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
