import OpenAI from "openai";
import { env } from '$amplify/env/getScheduleSummary';
import { Logger } from "@aws-lambda-powertools/logger";
import * as Sentry from "@sentry/node";

import { Schema } from "../../data/resource";

interface Planting {
  name: string
  transplantingDate: string
  harvestStartDate: string
  harvestEndDate: string
}

const logger = new Logger({ serviceName: "getScheduleSummary" });

export const handler: Schema["getScheduleSummary"]["functionHandler"]  = async (event) => {

  const openai = new OpenAI({
    apiKey: env.API_KEY
  });
  const { climateData, plantingSchedule } = event.arguments;

  if (
    climateData === null ||
    climateData === undefined ||
    plantingSchedule === null ||
    plantingSchedule === undefined
  ) {
    Sentry.captureMessage("Error in getScheduleSummary function. Climate data or crop data not provided.", "error");
    return JSON.stringify({error: "Climate data or crop data not provided."})
  }

  const parsedPlantingSchedule: Planting[][] = JSON.parse(plantingSchedule)
  const formattedPlantingSchedule = parsedPlantingSchedule.map((plot, index) =>
    `Plot ${index + 1}: \n\n` +
    plot.map(planting => Object.entries(planting).map(e => `${e[0]}: ${e[1]}`).join("\n")).join("\n\n") +
    "\n"
  ).join("\n\n")

  const userPrompt = getUserPrompt(climateData, formattedPlantingSchedule)
  logger.info(userPrompt)

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
  });

  return completion.choices[0].message.content;
};

const systemPrompt =
  "You are a helpful assistant tasked with summarizing a planting schedule for a new home vegetable gardener. Below is a summary of predicted climate conditions, and a crop planting schedule. Provide a one-paragraph summary, 60-100 words, of what the gardener can expect in both growing and harvesting. This summary does not require context, as there will be an introduction paragraph for the user to read before the summary.\n" +
  "\n" +
  "### Guidelines\n" +
  " - The audience of this summary is a home gardener who has just created a garden plan and is seeing it for the first time. Be informative and not too verbose. Write as though to the gardener themself, (i.e. use `you` instead of 3rd person).\n" +
  " - Planting dates for crops of `sowingStrategy = Transplant seedlings` represent the date that seedlings are transplanted into the garden." +
  // " - Reference specific crops or varieties included in their plan.\n" +
  // " - Focus on chronological growing and harvesting events, so that the summary reads a bit like a very short story about the harvests of the year to come.\n" +
  // " - Focus on how the types, timings, and durations of harvests will affect the overall garden production throughout the year." +
  // I think this one is good ^ because the user should get a verbal summary of what the crops will be like. But, one example showed things coming out of order a bit. It should read like a very short story.
  // " - The user, a home vegetable gardener, is the audience. Be informative but not too formal.\n" +
  // " - Do not explain the purpose of the plan. This will be explained in an earlier paragraph.\n" +
  // " - Do not mention what year the plan takes place in.\n" +
  // " - Reference the number of plots used by the plan, explaining that these are subdivisions of a user's available gardening space (for example, if a plan includes four plots and the user has four garden beds, each bed is a plot. If the plan uses for plots and the user only has two garden beds, then each plot represents half of a garden bed.)\n" +
  " - Don't give instructions—this will be covered in other parts of the plan. For example, one previous output to this prompt ended with `Attention to frost hardiness will ensure bountiful success.` That sounds unnecessary and wordy. If you don't have enough information say on-topic things about the schedule itself, just give a shorter answer.\n" +
  // " - Don't repeat the names of crop varieties.\n" +
  " - Do not reference the year 2025.\n" +
  // " - Do not repeat information from the `Introduction Paragraph`, listed below\n" +
  // " - This text will be put into a react node, so delineate the two paragraphs with a newline character.\n" +
  // "\n" +
  // "### Introduction Paragraph\n" +
  // "Your 2025 planting schedule optimizes the productivity of your garden by timing when to plant and harvest each crop. The color-coded diagram shows where each crop belongs, and some crops are scheduled to follow others in the same areas—a method called succession planting that maximizes space by staggering planting times.\n" +
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
