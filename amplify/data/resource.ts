import { type ClientSchema, a, defineData } from "@aws-amplify/backend"
import { promptLLM } from "../functions/promptLLM/resource"

const schema = a.schema({
  promptLLM: a
    .query()
    .arguments({
      prompt: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(promptLLM))
    .authorization(allow => [
      // TODO need to use authorization to protect backend. https://docs.amplify.aws/react/build-a-backend/data/customize-authz/
      allow.publicApiKey(),
    ]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",

    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
