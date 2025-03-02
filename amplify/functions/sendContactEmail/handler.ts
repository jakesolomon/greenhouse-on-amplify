import {SendEmailCommand, SESClient} from "@aws-sdk/client-ses";

import {Schema} from "../../data/resource";

export const handler: Schema["sendContactEmail"]["functionHandler"]  = async (event) => {

  const { senderAddress, subject, senderMessage } = event.arguments

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
  await sesClient.send(sesCommand)

  return JSON.stringify('success')
};
