import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { readFileSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";

export async function docsRouter(fastify: FastifyInstance) {
  // Load the YAML specification
  const apiSpecPath = join(__dirname, "..", "docs", "apispec.yml");
  const apiSpecContent = readFileSync(apiSpecPath, "utf8");
  const apiSpec = yaml.load(apiSpecContent) as any;

  // Register swagger with the loaded spec
  await fastify.register(swagger, {
    mode: "static",
    specification: {
      document: apiSpec,
    },
  });

  // Register swagger UI to serve on root route
  await fastify.register(swaggerUi, {
    routePrefix: "/",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
    staticCSP: false,
    transformSpecificationClone: true,
  });
}
