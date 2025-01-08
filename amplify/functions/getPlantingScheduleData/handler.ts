import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { env } from '$amplify/env/getPlantingScheduleData';

import { Schema } from "../../data/resource";

// These types adhere to the response format in /src/types.ts

const Planting = z.object({
  name: z.string(),
  transplantingDate: z.string(),
  harvestStartDate: z.string(),
  harvestEndDate: z.string()
});

const PlantingScheduleOutput = z.object({
  // summary: z.string(),
  plots: z.array(z.array(Planting)),
  advice: z.array(z.string()),
});

export const handler: Schema["getPlantingScheduleData"]["functionHandler"]  = async (event) => {

  const openai = new OpenAI({
    apiKey: env.API_KEY
  });
  const { climateData, crops } = event.arguments;

  if (
    climateData === null ||
    climateData === undefined ||
    crops === null ||
    crops === undefined
  ) {
    return JSON.stringify({error: "Climate data or crop data not provided."})
  }

  const userPrompt = plantingScheduleUserPrompt(climateData, crops)

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0,
    top_p: 0,
    messages: [
      { role: "system", content: plantingScheduleSystemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: zodResponseFormat(PlantingScheduleOutput, "planting_schedule_output"),
  });

  const plantingScheduleOutput = completion.choices[0].message;
  if (plantingScheduleOutput.refusal) {
    console.log(plantingScheduleOutput.refusal);
  }

  return plantingScheduleOutput.content;
};

const plantingScheduleSystemPrompt =
  "You are a gardening assistant tasked with creating planting schedules for the year 2025 that maximize harvests and meet user-defined goals. Based on the provided climate conditions (delineated by triple backticks) and crop characteristics (also delineated by triple backticks), generate a JSON-formatted planting schedule.\n" +
  // "In addition, produce a summary describing the gardening plan. The tone should be informative but also not too impersonal, focusing on information that would encourage home gardeners. It should be 4-8 sentences long and would explain how the visual diagram in their plan informs the user about when to plant their crops, as well as in which areas of their garden. (The UI of the plan includes a color-coded diagram of planting times where each planting is colored to indicate which plot it is in.)\n" +
  "In addition, use the `advice` parameter of our output to summarize some of the most important points of guidance for successfully growing these crops/varieties. Draw upon specific details collected from crop data, or your general knowledge about these crop types. Aim for 4-7 pointers, each 1-3 sentences long.\n" +
  "\n" +
  "### Format:\n" +
  "“Plot List”: an array of plots\n" +
  "“Plot”: an array of plantings\n" +
  "“Planting”: a crop which occupies a plot for a given amount of time (the growth duration plus the harvest duration)\n" +
  "\n" +
  "### Steps:\n" +
  "1. **Create New Plot:** If there is no existing plot, create “Plot 1”. If there are already plots, create a new plot and iterate the number.\n" +
  "2. **Create Earliest Planting:** For the plot created in step 1, pick a crop from the list of user-supplied crops and create a planting.\n" +
  "3. **Fill Plot With Plantings:** Select the next crop that can be used to create a planting in this plot. Prioritize the crop that can be planted as closely as possible to the end of the harvest of the previous planting. Selection of a crop should follow the following rules:\n" +
  "  - Prioritize the crop that can be transplanted with the least amount of time after the harvest duration of the previous planting is complete.\n" +
  "  - The second planting in a plot should be of a crop with a long growing and/or harvest duration.\n" +
  "  - Do not select a crop whose growth and harvest durations would not be complete before temperatures exceed or drop below the crop’s tolerance range.\n" +
  "  - Do not select a crop whose growing or harvest durations would conflict with the previous planting.\n" +
  "  - Do not select a crop that has already been used in any planting.\n" +
  "Repeat this step until the end of the year is reached, or no more crops can be planted due to constraints of growing conditions.\n" +
  "4. **Create New Plots:** Repeat steps 1–3 until all crops have been used in a planting.\n" +
  "\n" +
  "### Guidelines:\n" +
  "   - Format dates as \"yyyy-mm-dd\"\n" +
  "   - Name crops according to their short name, not their variety. (e.g. a crop with name `Carrot` and variety `Carrot Seeds - Tendersweet` should be named `Carrot` in the planting.)\n" +
  "\n"

const plantingScheduleUserPrompt = (climateData: string, cropData: string) =>
  "**Climate Data:**\n" +
  "```" +
  climateData +
  "```" +
  "\n" +
  "**Crop Data:**\n" +
  "```" +
  cropData +
  "```"
