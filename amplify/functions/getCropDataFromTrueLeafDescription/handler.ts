import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { env } from '$amplify/env/getCropDataFromTrueLeafDescription';
import * as Sentry from "@sentry/node";

import { Schema } from "../../data/resource";

const Crop = z.object({
  shortDescription: z.string(),
  varietyTitle: z.string(),
  daysToMaturity: z.number().int().nullable(),
  guidance: z.string(),
});

Sentry.init({
  dsn: "https://f07cd6da9a3fe49e5326614e1e037798@o470321.ingest.us.sentry.io/4510620412215296",
});

export const handler: Schema["getCropDataFromTrueLeafDescription"]["functionHandler"]  = async (event) => {

  const { varietyDescription } = event.arguments
  if (!varietyDescription) {
    Sentry.captureMessage("Error in getCropDataFromTrueLeafDescription function. No varietyDescription provided.", "error");
    return JSON.stringify({ error: "No varietyDescription provided." })
  }
  const delineateCropData = (varietyData: string) => "**Variety Description:**\n```" + varietyData + "\n```\n\n"

  const openai = new OpenAI({
    apiKey: env.API_KEY
  });

  // Send variety description to LLM for data extraction.
  const varietyDataExtractionCompletion = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      { role: "system", content: dataExtractionSystemPrompt },
      { role: "user", content: delineateCropData(varietyDescription!) },
    ],
    response_format: zodResponseFormat(Crop, "crop_data_output"),
  });

  // If data extraction request returns a refusal, log and return error.
  const varietyDataExtractionOutput = varietyDataExtractionCompletion.choices[0].message;
  if (varietyDataExtractionOutput.refusal) {
    Sentry.captureMessage(`getCropDataFromTrueLeafDescription request to LLM refused: ${varietyDataExtractionOutput.refusal}`, "error");
    return JSON.stringify({ error: "getCropDataFromTrueLeafDescription request to LLM refused." });
  }

  const appendedVarietyDataExtraction = JSON.parse(varietyDataExtractionOutput.content!)
  appendedVarietyDataExtraction.dataSource = "variety"
  return JSON.stringify(appendedVarietyDataExtraction)
};

const dataExtractionSystemPrompt =
  "You are a gardening assistant tasked with providing helpful information about crops. Based on the provided variety description (delineated by triple backticks), generate a JSON-formatted Crop object that contains the output parameters listed below.\n" +
  "\n" +
  "### Output Properties\n" +
  " - description (30-45 words summarizing the characteristics of the variety of crop. Focused on attractive details, as though writing a product summary to inform a first-time gardener, rather than instructions. You do not need to use complete sentences.)\n" +
  " - varietyTitle: (Find the name of the crop. Do not include the name of the crop itself, or the words seeds. For example, `Pepper Seeds - Sweet - Cal Wonder (Organic)` should just be called `Cal Wonder`, and `Bean Seeds - Bush - Contender` should just be called `Contender`.)" +
  " - daysToMaturity (The number of days for a seed to go from germination or transplanting to harvest. If the days to maturity are provided as a range, provide the average of the values. If this information is not explicitly defined in the crop description, leave this value null.)\n" +
  " - guidance: (A few sentences on common issues someone may experience growing this plant, as well as how to remedy or proactively avoid them.)\n" +
  "\n"
