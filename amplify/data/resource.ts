import { type ClientSchema, a, defineData } from "@aws-amplify/backend"
import { getCropData } from "../functions/getCropData/resource"
import { getCompanionPlants } from "../functions/getCompanionPlants/resource"
import { getTrueLeafSeedData } from "../functions/getTrueLeafSeedData/resource";
import { getCropDataFromTrueLeafDescription } from "../functions/getCropDataFromTrueLeafDescription/resource";
import { getClimateData } from "../functions/getClimateData/resource"
import { getScheduleSummary } from "../functions/getScheduleSummary/resource"
import { getPlantingScheduleData } from "../functions/getPlantingScheduleData/resource"
import { createCheckoutSession } from "../functions/createCheckoutSession/resource"
import { handleStripePurchase } from "../functions/handleStripePurchase/resource";

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

  getCompanionPlants: a
    .query()
    .arguments({
      climateData: a.string(),
      plantingSchedule: a.string()
    })
    .returns(a.string())
    .handler(a.handler.function(getCompanionPlants))
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  getTrueLeafSeedData: a
    .query()
    .arguments({
      cropTypes: a.string(),
      mode: a.string()
    })
    .returns(a.string())
    .handler(a.handler.function(getTrueLeafSeedData))
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  getCropDataFromTrueLeafDescription: a
    .query()
    .arguments({
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
      plantingSchedule: a.string()
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

  createCheckoutSession: a
    .query()
    .returns(a.string())
    .arguments({
      origin: a.string()
    })
    .handler(a.handler.function(createCheckoutSession))
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  handleStripePurchase: a
    .query()
    .arguments({
      sessionId: a.string().required(),
      fileData: a.string().required()
    })
    .returns(a.string())
    .handler(a.handler.function(handleStripePurchase))
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
