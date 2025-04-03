import { env } from '$amplify/env/handleStripePurchase';
import {Logger} from "@aws-lambda-powertools/logger";
import {SendEmailCommand, SESClient} from "@aws-sdk/client-ses";
import {S3Client, PutObjectCommand, GetObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Stripe from 'stripe';

import {Schema} from "../../data/resource";
import generateMonthlyPlan from "./monthly-plan";

const logger = new Logger({ serviceName: "handleStripePurchase" });

interface GrowingDateRange {
  transplantingDate: Date
  harvestStartDate: Date
  harvestEndDate: Date
}

interface Crop {
  name: string;
  variety: string;
  shortDescription: string;
  storeHandle?: string;
  imageUrl?: string;

  optimalGrowingDateRanges: GrowingDateRange[]
  frostHardy: boolean;
  directSow: boolean;
  guidance: string;

  lowerTempBound: number;
  upperTempBound: number;
}

interface IntroExtras {
  pruning: string,
  supportStructures: string
}

interface FullPlanSummaries {
  January: string,
  February: string,
  March: string,
  April: string,
  May: string,
  June: string,
  July: string,
  August: string,
  September: string,
  October: string,
  November: string,
  December: string,
}

interface FullPlanTasksPerCrop {
  January: string[],
  February: string[],
  March: string[],
  April: string[],
  May: string[],
  June: string[],
  July: string[],
  August: string[],
  September: string[],
  October: string[],
  November: string[],
  December: string[],
}

interface FullPlanTaskList {
  plot: number,
  crop: string,
  tasks: FullPlanTasksPerCrop
}

export const handler: Schema["handleStripePurchase"]["functionHandler"]  = async (event) => {

  const { sessionId, introExtras, allTasks, summaries, scheduleSummary, crops, gantt } = event.arguments

  const introExtrasParsed: IntroExtras = JSON.parse(introExtras)
  const allTasksParsed: FullPlanTaskList[] = JSON.parse(allTasks)
  const summariesParsed: FullPlanSummaries = JSON.parse(summaries)
  const cropsParsed: Crop[] = JSON.parse(crops)

  // const blob = await generateMonthlyPlan()
  //
  // // Convert Blob to Base64
  // const reader = new FileReader();
  // // TODO !
  // reader.readAsDataURL(blob!);
  // reader.onloadend = async () => {
  //   if (typeof reader.result === "string") {
  //     const base64Pdf = reader.result.split(',')[1]; // Remove the "data:application/pdf;base64," prefix
  //   }
  // }
  //
  //
  //
  // const buffer = Buffer.from(base64Pdf, 'base64');

  const buffer = await generateMonthlyPlan(
    introExtrasParsed, allTasksParsed, summariesParsed, scheduleSummary, cropsParsed, gantt
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
    return JSON.stringify({responseCode: 400})
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

  const getObjectCommand = new GetObjectCommand({ Bucket: 'aws-growing-guide-plan-v1', Key: fileName });
  const clientUrl = await getSignedUrl(s3Client, getObjectCommand, {expiresIn: 3600});
  return JSON.stringify(clientUrl)
};
