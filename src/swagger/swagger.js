import swaggerJsdoc from "swagger-jsdoc";
// import path from "path"
// const __dirname = path.resolve();
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Swagger configuration options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation For Reward System",
      version: "1.0.0",
      description: "Documentation of APIs",
    },
    
    servers: [
      {
        url: process.env.SWAGGER_URL,
        // url: `http://localhost:${process.env.PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", 
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [`${__dirname}/Routes/auth.js`,
  `${__dirname}/Routes/user.js`,
  `${__dirname}/Routes/task.js`,
  `${__dirname}/Routes/group.js`,
],
};

const specs = swaggerJsdoc(options);
export { specs };
