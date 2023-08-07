import { Static, TSchema } from "npm:@sinclair/typebox";
import Ajv from "https://esm.sh/ajv@8.12.0";

const ajv = new Ajv({
  discriminator: true,
});

export default function model<const T extends TSchema>(schema: T) {
  type Validate = (value: unknown) => value is Static<T>;
  if ("discriminator" in schema) {
    const s = schema as any;
    s.type = "object";
    s.oneOf = s.anyOf;
    delete s.anyOf;
  }
  const validate = ajv.compile(schema) as Validate;
  return {
    schema,
    validate,
  };
}

export type Model<T extends ReturnType<typeof model>> = Static<T["schema"]>;
