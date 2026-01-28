import {SendEmailCommand, SESClient} from "@aws-sdk/client-ses";
import * as Sentry from "@sentry/node";

import {Schema} from "../../data/resource";

Sentry.init({
  dsn: "https://f07cd6da9a3fe49e5326614e1e037798@o470321.ingest.us.sentry.io/4510620412215296",
});

export const handler: Schema["sendContactEmail"]["functionHandler"]  = async (event) => {

  const { senderAddress, subject, senderMessage } = event.arguments

  if (
    senderAddress === null ||
    senderAddress === undefined ||
    subject === null ||
    subject === undefined ||
    senderMessage === null ||
    senderMessage === undefined
  ) {
    Sentry.captureMessage("Error in sendContactEmail function. Sender address, subject, or message not provided.", "error");
    return JSON.stringify({ error: "Sender address, subject, or message not provided." })
  }

  const REGION = "us-east-1";
  const sesClient = new SESClient({ region: REGION });

  const sesInput = {
    "Destination": {
      "BccAddresses": [],
      "CcAddresses": [],
      "ToAddresses": [
        "jake@thegrowingguide.com"
      ]
    },
    "Message": {
      "Body": {
        "Html": {
          "Charset": "UTF-8",
          "Data": `Contact form was fulfilled by sender ${senderAddress} with the following content: <br/><br/> ${senderMessage}`
        },
        "Text": {
          "Charset": "UTF-8",
          "Data": `Contact form was fulfulled by sender ${senderAddress} with the following content: <br/><br/> ${senderMessage}`
        }
      },
      "Subject": {
        "Charset": "UTF-8",
        "Data": `Customer Service: ${subject}`
      }
    },
    "Source": "jake@thegrowingguide.com",
  };

  const sesCommand = new SendEmailCommand(sesInput);
  try {
    await sesClient.send(sesCommand)
  } catch (error) {
    Sentry.captureMessage(`Error in sendContactEmail function. Error: ${error}.`, "error");
    return JSON.stringify({ error: `sendContactEmail function failed. Error: ${error}` });
  }

  return JSON.stringify('success')
};
