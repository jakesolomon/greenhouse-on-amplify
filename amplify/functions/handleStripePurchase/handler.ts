import { env } from '$amplify/env/handleStripePurchase';
import {Logger} from "@aws-lambda-powertools/logger";
import {SendEmailCommand, SESClient} from "@aws-sdk/client-ses";
import {S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import Stripe from 'stripe';
import OpenAI from "openai";
import {zodResponseFormat} from "openai/helpers/zod";
import {z} from "zod";

import {Schema} from "../../data/resource";
import generateMonthlyPlan from "./monthly-plan";
import {
  Crop,
  CropDataForLLMRequests,
  IntroExtras,
  FullPlanSummaries,
  FullPlanTaskList, AppendedPlanting,
  Planting,
} from "./types"
import {
  introExtrasSystemPrompt,
  introExtrasUserPrompt,
  tasksSystemPrompt,
  tasksUserPrompt,
  summariesSystemPrompt,
  summariesUserPrompt
} from "./prompts";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY
});

const IntroExtrasOutput = z.object({
  pruning: z.string(),
  supportStructures: z.string()
});
const TasksOutput = z.object({
  January: z.array(z.string()),
  February: z.array(z.string()),
  March: z.array(z.string()),
  April: z.array(z.string()),
  May: z.array(z.string()),
  June: z.array(z.string()),
  July: z.array(z.string()),
  August: z.array(z.string()),
  September: z.array(z.string()),
  October: z.array(z.string()),
  November: z.array(z.string()),
  December: z.array(z.string()),
});
const SummariesOutput = z.object({
  January: z.string(),
  February: z.string(),
  March: z.string(),
  April: z.string(),
  May: z.string(),
  June: z.string(),
  July: z.string(),
  August: z.string(),
  September: z.string(),
  October: z.string(),
  November: z.string(),
  December: z.string(),
});

const callLLM = async (
  systemPrompt: string,
  userPrompt: string,
  responseFormat: typeof IntroExtrasOutput | typeof TasksOutput | typeof SummariesOutput,
  responseFormatName: string
) => {
  logger.info(`Prompting LLM for ${responseFormatName} with userPrompt: `, userPrompt)
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {role: "system", content: systemPrompt},
      {role: "user", content: userPrompt}
    ],
    response_format: zodResponseFormat(responseFormat, responseFormatName),
  });
  logger.info(`LLM response for ${responseFormatName}: `, response.choices[0].message.content!)
  return JSON.parse(response.choices[0].message.content!);
}

const logger = new Logger({ serviceName: "handleStripePurchase" });

export const handler: Schema["handleStripePurchase"]["functionHandler"]  = async (event) => {

  const { sessionId, scheduleSummary, crops, gantt, plantingSchedule, climateData, companionPlantingAdvice } = event.arguments

  const cropsParsed: Crop[] = JSON.parse(crops)
  const plantingScheduleParsed: Planting[][] = JSON.parse(plantingSchedule)
  const appendedPlantingSchedule: AppendedPlanting[][] = plantingScheduleParsed.map(plot => {
    return plot.map(planting => ({
      ...planting,
      directSow: cropsParsed.find(crop => crop.name === planting.name)!.directSow
    }))
  })

  const cropsEssentialForLLM: CropDataForLLMRequests[] = cropsParsed.map((crop: Crop) => ({
    name: crop.name,
    variety: crop.variety,
    directSow: crop.directSow,
  }))

  // TODO: could optimize speed by getting intro extras at the same time as tasks
  // Get intro extras
  const introExtras: IntroExtras = await callLLM(
    introExtrasSystemPrompt,
    introExtrasUserPrompt(cropsEssentialForLLM),
    IntroExtrasOutput,
    "intro_extras_output"
  )

  // Get tasks
  const taskPromises = appendedPlantingSchedule.flatMap((plot, plotIndex) => {
    return plot.map(async (planting, plantingIndex) => {
      const tasks = await callLLM(
        tasksSystemPrompt,
        tasksUserPrompt(planting, climateData, plot[plantingIndex + 1]),
        TasksOutput,
        "tasks_output"
      );
      return { plot: plotIndex + 1, crop: planting.name, tasks: tasks };
    });
  });
  const allTasks: FullPlanTaskList[] = await Promise.all(taskPromises)

  // Get summaries
  const summaries: FullPlanSummaries = await callLLM(
    summariesSystemPrompt,
    summariesUserPrompt(allTasks, companionPlantingAdvice, climateData),
    SummariesOutput,
    "summaries_output"
  )

  // Generate Monthly Plan PDF
  const buffer = await generateMonthlyPlan(
    introExtras, allTasks, summaries, scheduleSummary, cropsParsed, gantt
  )

  const stripe = new Stripe(env.STRIPE_API_KEY);

  const REGION = "us-east-1";
  const sesClient = new SESClient({ region: REGION });
  const s3Client = new S3Client({ region: REGION });

  // First check if this file has already been uploaded, in case of multiple fulfillment function calls for the same order

  const session = await stripe.checkout.sessions.retrieve(sessionId)
  logger.info(session.customer_details!.email!)
  // remove "." and after from email to avoid file type issues
  const customerEmail = session.customer_details!.email;

  if (!customerEmail) {
    logger.error(`Could not get customer email for session ${sessionId}`)
    // return JSON.stringify({responseCode: 400})
    return;
  }

  const customerIdentifier = customerEmail.split(".")[0];
  const fileName = `GrowingGuidePlan-${customerIdentifier}-${sessionId}.pdf`

  try {
    const putObjectInput: PutObjectCommandInput = {
      "Body": buffer,
      "Bucket": "aws-growing-guide-plan-v1",
      "Key": fileName,
      "IfNoneMatch": "*",
      "GrantRead": "",
      "ContentType": "application/pdf",
      "ContentDisposition": "inline",
    };
    const putObjectCommand = new PutObjectCommand(putObjectInput);
    // If fulfillment has already occurred, the key will already exist and this will throw error:
    // "PreconditionFailed: At least one of the pre-conditions you specified did not hold"
    await s3Client.send(putObjectCommand)

    // Specifying ContentType and ContentDisposition means this will open in safari mobile but download on laptop.
    // const geObjectInput: GetObjectCommandInput = {
    //   Bucket: 'aws-growing-guide-plan-v1',
    //   Key: fileName,
    //   ResponseContentType: "application/pdf",
    //   ResponseContentDisposition: "inline"
    // }
    // const getObjectCommand = new GetObjectCommand(geObjectInput);
    // const clientUrl = await getSignedUrl(s3Client, getObjectCommand, {expiresIn: 3600});
    const clientUrl =
      `https://aws-growing-guide-plan-v1.s3.us-east-1.amazonaws.com/${fileName}`

    const sesInput = {
      "Destination": {
        "BccAddresses": [
          "jake@thegrowingguide.com"
        ],
        "CcAddresses": [],
        "ToAddresses": [
          customerEmail
        ]
      },
      "Message": {
        "Body": {
          "Html": {
            "Charset": "UTF-8",
            "Data": `Here's the link to your plan: <a class="ulink" href=${clientUrl} target="_blank">Growing Guide Plan</a>.`
          },
          "Text": {
            "Charset": "UTF-8",
            "Data": `Here's the link to your plan: ${clientUrl}`
          }
        },
        "Subject": {
          "Charset": "UTF-8",
          "Data": "Your Garden Plan"
        }
      },
      "Source": "jake@thegrowingguide.com",
    };

    const sesCommand = new SendEmailCommand(sesInput);
    await sesClient.send(sesCommand)
  } catch (error) {
    logger.error(`Error fulfilling order ${sessionId} for customer ${customerEmail}: ${error}`)
  }
  return;
};
