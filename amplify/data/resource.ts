import { type ClientSchema, a, defineData } from "@aws-amplify/backend"
import { getCropData } from "../functions/getCropData/resource"
import { getCompanionPlants } from "../functions/getCompanionPlants/resource"
import { getTrueLeafSeedData } from "../functions/getTrueLeafSeedData/resource";
import { getCropDataFromTrueLeafDescription } from "../functions/getCropDataFromTrueLeafDescription/resource";
import { getClimateData } from "../functions/getClimateData/resource"
import { getFullPlanContent } from "../functions/getFullPlanContent/resource"
import { getScheduleSummary } from "../functions/getScheduleSummary/resource"
import { getPlantingScheduleData } from "../functions/getPlantingScheduleData/resource"
import { createCheckoutSession } from "../functions/createCheckoutSession/resource"
import { handleStripePurchase } from "../functions/handleStripePurchase/resource";
import {getFullPlanIntroExtras} from "../functions/getFullPlanIntroExtras/resource";
import {getFullPlanTasks} from "../functions/getFullPlanTasks/resource";
import { getFullPlanSummaries } from "../functions/getFullPlanSummaries/resource";
import { sendContactEmail } from "../functions/sendContactEmail/resource";
import { sendPrivySignup } from "../functions/sendPrivySignup/resource";
import {fulfillV2Guide} from "../functions/fulfillV2Guide/resource";

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

  getFullPlanContent: a
    .query()
    .arguments({
      crops: a.string().required(),
      plantingSchedule: a.string().required(),
      climateData: a.string().required(),
      companionPlantingAdvice: a.string().required(),
    })
    .returns(a.string())
    .handler(a.handler.function(getFullPlanContent))
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  getFullPlanIntroExtras: a
    .query()
    .arguments({
      crops: a.string().required(),
    })
    .returns(a.string())
    .handler(a.handler.function(getFullPlanIntroExtras))
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  getFullPlanTasks: a
    .query()
    .arguments({
      crops: a.string().required(),
      plantingSchedule: a.string().required(),
      climateData: a.string().required(),
    })
    .returns(a.string())
    .handler(a.handler.function(getFullPlanTasks))
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  getFullPlanSummaries: a
    .query()
    .arguments({
      tasks: a.string().required(),
      climateData: a.string().required(),
      companionPlantingAdvice: a.string().required(),
    })
    .returns(a.string())
    .handler(a.handler.function(getFullPlanSummaries))
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
      origin: a.string(),
      product: a.string(),
      automaticallyApplyWelcome15: a.string().required()
    })
    .handler(a.handler.function(createCheckoutSession))
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  fulfillV2Guide: a
    .query()
    .arguments({
      sessionId: a.string().required(),
      product: a.string().required(),
      scheduleSummary: a.string().required(),
      crops: a.string().required(),
      gantt: a.string().required(),
      plantingSchedule: a.string().required(),
      climateData: a.string().required(),
      companionPlantingAdvice: a.string().required(),
    })
    .handler(a.handler.function(fulfillV2Guide).async())
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  handleStripePurchase: a
    .query()
    .arguments({
      sessionId: a.string().required(),
      product: a.string().required(),
      // introExtras: a.string().required(),
      // allTasks: a.string().required(),
      // summaries: a.string().required(),
      scheduleSummary: a.string().required(),
      crops: a.string().required(),
      gantt: a.string().required(),
      plantingSchedule: a.string().required(),
      climateData: a.string().required(),
      companionPlantingAdvice: a.string().required(),
    })
    .handler(a.handler.function(handleStripePurchase).async())
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  sendContactEmail: a
    .query()
    .arguments({
      senderAddress: a.string().required(),
      subject: a.string().required(),
      senderMessage: a.string().required()
    })
    .returns(a.string())
    .handler(a.handler.function(sendContactEmail))
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  sendPrivySignup: a
    .query()
    .arguments({
      emailAddress: a.string().required(),
      url: a.string().required(),
      shouldUseV2EmbedForm: a.string().required()
    })
    .returns(a.string())
    .handler(a.handler.function(sendPrivySignup))
    .authorization(allow => [
      allow.publicApiKey(),
    ]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",

    // AppSync caps API keys at 365 days. When the key expires every public query
    // returns 401 and the planner stalls, so redeploy before the year is up to rotate it.
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
