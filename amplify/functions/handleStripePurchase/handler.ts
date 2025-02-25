import { env } from '$amplify/env/handleStripePurchase';
import {Logger} from "@aws-lambda-powertools/logger";
import {SendEmailCommand, SESClient} from "@aws-sdk/client-ses";
import {S3Client, PutObjectCommand, GetObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Stripe from 'stripe';

import {Schema} from "../../data/resource";

const logger = new Logger({ serviceName: "handleStripePurchase" });

export const handler: Schema["handleStripePurchase"]["functionHandler"]  = async (event) => {

  // const { sessionId, fileData, email } = event.arguments
  const { sessionId, fileData } = event.arguments
  const buffer = Buffer.from(fileData, 'base64');

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
