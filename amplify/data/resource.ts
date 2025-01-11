import { type ClientSchema, a, defineData } from "@aws-amplify/backend"
import { getCropData } from "../functions/getCropData/resource"
import { getTrueLeafSeedData } from "../functions/getTrueLeafSeedData/resource";
import { getCropDataFromTrueLeafDescription } from "../functions/getCropDataFromTrueLeafDescription/resource";
import { getClimateData } from "../functions/getClimateData/resource"
import { getScheduleSummary } from "../functions/getScheduleSummary/resource"
import { getPlantingScheduleData } from "../functions/getPlantingScheduleData/resource"

const schema = a.schema({
  getCropData: a
    .query()
    .arguments({
      prompt: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(getCropData))
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  getClimateData: a
    .query()
    .arguments({
      zipCode: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(getClimateData))
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  getTrueLeafSeedData: a
    .query()
    .arguments({
      cropTypes: a.string()
    })
    .returns(a.string())
    .handler(a.handler.function(getTrueLeafSeedData))
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  getCropDataFromTrueLeafDescription: a
    .query()
    .arguments({
      generalDataHandle: a.string(),
      varietyDescription: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(getCropDataFromTrueLeafDescription))
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  getScheduleSummary: a
    .query()
    .arguments({
      climateData: a.string(),
      crops: a.string()
    })
    .returns(a.string())
    .handler(a.handler.function(getScheduleSummary))
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  getPlantingScheduleData: a
    .query()
    .arguments({
      climateData: a.string(),
      crops: a.string()
    })
    .returns(a.string())
    .handler(a.handler.function(getPlantingScheduleData))
    .authorization(allow => [
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
