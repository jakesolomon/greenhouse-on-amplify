import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { env } from '$amplify/env/getCompanionPlants';
import * as Sentry from "@sentry/node";

import { Schema } from "../../data/resource";

// These types adhere to the response format in /src/types.ts

interface Planting {
  name: string
  transplantingDate: string
  harvestStartDate: string
  harvestEndDate: string
}

Sentry.init({
  dsn: "https://f07cd6da9a3fe49e5326614e1e037798@o470321.ingest.us.sentry.io/4510620412215296",
});

const getCompanionPlantsOutput = z.object({
  companionPlantingAdvice: z.array(z.string()),
});

export const handler: Schema["getCompanionPlants"]["functionHandler"]  = async (event) => {

  const { climateData, plantingSchedule } = event.arguments;
  if (
    climateData === null ||
    climateData === undefined ||
    plantingSchedule === null ||
    plantingSchedule === undefined
  ) {
    Sentry.captureMessage(`Error in getCompanionPlants function. Climate data or planting schedule not provided.`, "error");
    return JSON.stringify({error: "Climate data or planting schedule not provided."})
  }

  const openai = new OpenAI({
    apiKey: env.API_KEY
  });

  const parsedPlantingSchedule: Planting[][] = JSON.parse(plantingSchedule)
  const formattedPlantingSchedule = parsedPlantingSchedule.map((plot, index) =>
    `Plot ${index + 1}: \n\n` +
    plot.map(planting => Object.entries(planting).map(e => `${e[0]}: ${e[1]}`).join("\n")).join("\n\n") +
    "\n"
  ).join("\n\n")

  const userPrompt = getUserPrompt(climateData, formattedPlantingSchedule)

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: zodResponseFormat(getCompanionPlantsOutput, "companion_plants_output"),
  });

  const overviewOutput = completion.choices[0].message;
  if (overviewOutput.refusal) {
    Sentry.captureMessage(`Companion plants chat to LLM refused: ${overviewOutput.refusal}`, "error");
    JSON.stringify({ error: "Companion plants chat to LLM refused." });
  }

  return overviewOutput.content;
};

// All the herbs and flowers listed on True Leaf (minus garlic bulbs) paired down by chat GPT by "likely to be useful as a companion plant in a vegetable garden".
const availableCompanionPlants = ["Amaranth", "Arugula", "Basil", "Borage", "Calendula", "Catnip", "Chamomile", "Chervil", "Chives", "Cilantro", "Dill", "Fennel", "Hyssop", "Lemon Balm", "Lemon Grass", "Lovage", "Marigold", "Mint", "Nasturtium", "Oregano", "Parsley", "Rosemary", "Sage", "Savory", "Shiso (Perilla)", "Spearmint", "Tarragon", "Thyme", "Yarrow (Achillea)"];

const systemPrompt =
  "You are a helpful assistant tasked with giving a new home vegetable gardener advice about companion planting. Below is a summary of predicted climate conditions, and a crop planting schedule, each delineated by triple backticks. Provide a list of recommendations for each `Plot`, including herbs and/or flowers that can be used in the garden to benefit the specific crops listed in each `Plot`. Use reliable gardening principles and validated horticultural knowledge.\n" +
  "\n" +
  "### Examples\n" +
  " - In this example, `Plot 1` includes beans growing in the springtime and cabbage growing later in the year. Rosemary is beneficial to both, and dill is beneficial to cabbage, so for this plot, you should recommend rosemary and dill. Chives are beneficial to cabbage but are potentially harmful to beans, so do not recommend it for this plot. Let’s also assume in this example that climate conditions predict a last spring frost in may, and growing recommendations for both are to plant after the danger of frost has passed, so recommend that the user plant them accordingly. Dill is most useful as a companion plant for a limited period during its early growth and flowering stages, so give instructions to plant multiple times throughout the year and remove plantings once they go to seed.\n" +
  " - In this example, `Plot 2` and `Plot 4` both include broccoli. Nasturtium is beneficial by trapping potential pests of broccoli, so recommend it as a companion plant outside of the garden area, such as planted in pots or the ground outside the perimeter of those plots—but not so close to the broccoli as to risk spreading pests to it. Nasturtium is more likely to flower with poor soil, so recommend not fertilizing the soil it is growing in.\n" +
  "\n" +
  "### Guidelines\n" +
  " - Format each recommendation list item with the plot number, three asterisks, and then the advice, as follows: `Plot 1:***1-3 sentences about what companion plants are recommended for crops in Plot 1 and how and where to plant them.`\n" +
  // " - Only recommend companion plants from the list below, delineated by triple backticks. Refer to them exactly by their name in the list. For example, `Yarrow` is listed as `Yarrow (Achillea)`. If you recommend this plant, it should be listed in your recommendation item as `Yarrow (Achillea)`.\n" +
  " - If there are no good recommendations to be made for a particular plot, do not create a list item for that plot at all.\n" +
  " - For aggressive growers like mint, recommend planting them in pots so they do not take over the garden.\n" +
  " - If a companion plant is useful for repelling pests from a crop, be specific about the pests that the crop is vulnerable to.\n" +
  "\n" +
  "### Available Companion Plants\n" +
  availableCompanionPlants.join(",") +
  "\n"

const getUserPrompt = (climateData: string, plantingSchedule: string) =>
  "**Climate Data:**\n" +
  "```" +
  climateData +
  "```" +
  "\n" +
  "**Planting Schedule:**\n" +
  "```" +
  plantingSchedule +
  "```"
