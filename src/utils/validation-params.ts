import * as Ajv from "ajv";
import * as restify from "restify";
import * as restifyErrors from "restify-errors";

const ajv = new Ajv({ coerceTypes: "array", allErrors: true });

function buildSchemaKey(req: restify.Request) {
  const route = req.getRoute();
  return `${route.method}_${route.path}`;
}

function parseParameters(req: restify.Request) {
  const paramsParsed = {};

  if (typeof req["route"] !== "object" || req["route"] === null
    || typeof req["route"].spec !== "object" || req["route"].spec === null) {
    throw new restifyErrors.InternalServerError({
      message: "Unexpected error during parameters validation"
    });
  }

  const parameters = req["route"].spec.parameters;

  if (!Array.isArray(parameters) || parameters.length === 0) {
    return null;
  }

  // Check if the schema has already been built
  const schemaKey = buildSchemaKey(req);
  let validate = ajv.getSchema(schemaKey);

  // Built it if necessary
  if (validate === undefined) {
    const schema = {
      parameters: {},
      properties: {},
      required: [],
      type: "object"
    };

    parameters.forEach((param) => {
      // add each param in the schemas
      schema.parameters[param.name] = param;
      schema.properties[param.name] = { $ref: `#/parameters/${param.name}` };

      // Check if params is required
      if (param.required === true) {
        schema.required.push(param.name);
      }
    });

    // delete required field if empty
    if (schema.required.length === 0) {
      delete schema["required"];
    }

    // register schema with ajv
    ajv.addSchema(schema, schemaKey);
    // Get the new schema generated for validation
    validate = ajv.getSchema(schemaKey);
  }

  // Build object for ajv validation
  parameters
    .filter((param) => {
      return typeof param === "object" && param !== null &&
        typeof param.name === "string" && param.name.length !== 0;
    })
    .map((param) => {
      paramsParsed[param.name] = req.params[param.name];
    });

  // Submit object to ajv validation
  const valid = validate(paramsParsed);
  if (!valid) {
    throw new restifyErrors.BadRequestError(ajv.errorsText(validate.errors, {dataVar: "query"}));
  }

  return paramsParsed;
}

export function validation(req: restify.Request, res: restify.Response, next: restify.Next) {

  try {
    const parameters = parseParameters(req);

    req["parameters"] = { ...parameters };

    next();
  } catch (err) {
    next(err);
    return;
  }
}
