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

// THIS ENDPOINT IS DEPRECATED.

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

  const { sessionId, product, scheduleSummary, crops, gantt, plantingSchedule, climateData, companionPlantingAdvice } = event.arguments

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

  const printCopyOrdered = product === "print"

  const customerIdentifier = customerEmail.split(".")[0];
  const fileName = `GrowingGuidePlan-${customerIdentifier}-${sessionId}.pdf`
  const productImage = 'https://aws-growing-guide-email-assets.s3.us-east-1.amazonaws.com/booklet-mockup-left.png'
  const emailHeader = 'https://aws-growing-guide-email-assets.s3.us-east-1.amazonaws.com/email-header.jpg'
  const clientUrl =
    `https://aws-growing-guide-plan-v1.s3.us-east-1.amazonaws.com/${fileName}`

  const digitalBody = `
    <h1>Your Monthly Guide is Ready!</h1>
    <p>Hello,</p>
    <p>
      Thank you for your purchase! We’re excited be a part of your garden experience. Your personalized Monthly Guide is now available for download.
    </p>
    <!-- Featured image placeholder (optional) -->
    <img class="image" aria-hidden="true" src=${productImage} alt="Monthly Guide Preview" />
    <p>
      To download your guide, simply click the button below:
    </p>
    <p>
      <a class="cta-button" href=${clientUrl} target="_blank">Download Your Guide</a>
    </p>
    <p>
      Let us know if you have any questions—just reply to this email.
    </p>
    <p>Jake from The Growing Guide</p>
  `

  const printBody = `
    <h1>Your Monthly Guide Is On Its Way!</h1>
    <p>Hello,</p>
    <p>
      Thank you for your purchase! We’re excited be a part of your garden experience. Your personalized Monthly Guide is being prepared for print, and we’ve also included a digital copy for you to download right away.
    </p>
    <img class="image" aria-hidden="true" src=${productImage} alt="Monthly Guide Preview" />
    <p>
      To get started now, click the button below to download your digital copy:
    </p>
    <p>
      <a class="cta-button" href=${clientUrl} target="_blank">Download Your Guide</a>
    </p>
    <p>
      Your printed guide is now in our queue. We’ll send you another email within 3–5 business days to let you know once it has been printed and shipped.
    </p>
    <p>
      Let us know if you have any questions—just reply to this email.
    </p>
    <p>Jake from The Growing Guide</p>
  `

  const htmlBody = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Your Growing Guide Planner is Ready!</title>
      <style type="text/css">
        /* Import Poppins and Merriweather Sans from Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Merriweather+Sans:wght@400;700&display=swap');
  
        body {
          margin: 0;
          padding: 0;
          background-color: #f6f6f6;
          font-family: 'Merriweather Sans', Arial, sans-serif;
          color: #333333;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          /*background-color: #4caf50;*/
          /*padding: 20px;*/
          /*text-align: center;*/
        }
        .header img {
          /*max-width: 150px;*/
          width: 100%;
        }
        h1, h2, h3 {
          font-family: 'Poppins', Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .content {
          padding: 20px;
          line-height: 1.5;
        }
        .cta-button {
          display: inline-block;
          background-color: #4caf50;
          color: #ffffff;
          padding: 15px 25px;
          text-decoration: none;
          border-radius: 4px;
        }
        .footer {
          background-color: #f0f0f0;
          text-align: center;
          font-size: 12px;
          padding: 15px;
          color: #777777;
        }
        .image {
          width: 100%;
          max-width: 600px;
          display: block;
          margin: 0 auto;
          pointer-events: none;
          user-select: none; 
        }
      </style>
    </head>
    <body>
      <table class="container" cellspacing="0" cellpadding="0">
        <tr>
          <td class="header">
            <!-- Replace with your logo URL -->
            <img aria-hidden="true" src=${emailHeader} alt="The Growing Guide" />
          </td>
        </tr>
        <tr>
          <td class="content">
            ${printCopyOrdered ? printBody : digitalBody}
          </td>
        </tr>
        <tr>
          <td class="footer">
            &copy; 2025 The Growing Guide. All rights reserved. &nbsp;|&nbsp;
            <a href="https://thegrowingguide.com" style="color: #777777; text-decoration: none;">Visit our website</a>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `

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
            "Data": htmlBody
          },
          "Text": {
            "Charset": "UTF-8",
            "Data": `Thank you for your purchase! We’re excited to help you transform your garden planning experience. Your personalized <a class="ulink" href=${clientUrl} target="_blank">Monthly Guide</a> is now available for download.`
          }
        },
        "Subject": {
          "Charset": "UTF-8",
          "Data": "Your Garden Guide"
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
