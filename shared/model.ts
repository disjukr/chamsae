import { Static, TSchema } from "npm:@sinclair/typebox";
import Ajv from "https://esm.sh/ajv@8.12.0";

const ajv = new Ajv();

export default function model<const T extends TSchema>(schema: T) {
  type Validate = (value: unknown) => value is Static<T>;
  const validate = ajv.compile(schema) as Validate;
  return {
    schema,
    validate,
  };
}

export type Model<T extends ReturnType<typeof model>> = Static<T["schema"]>;
