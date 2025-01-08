import OpenAI from "openai";
import { env } from '$amplify/env/getPlantingScheduleData';

import { Schema } from "../../data/resource";

export const handler: Schema["getScheduleSummary"]["functionHandler"]  = async (event) => {

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

  const userPrompt = getUserPrompt(climateData, crops)

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
  });

  // const scheduleSummary = completion.choices[0].message;
  // if (scheduleSummary.refusal) {
  //   console.log(scheduleSummary.refusal);
  // }

  return completion.choices[0].message.content;
};

const systemPrompt =
  "You are a gardening assistant tasked with summarizing a planting schedule for a new home vegetable gardener. Below is a summary of predicted climate conditions, and a set of crops and varieties that have been selected to use in a user's gardening plan. Provide a 30-55 word summary of what the gardener can expect in both growing and harvesting. This summary does not require context, as there will be an introduction paragraph for the user to read before the summary.\n" +
  "\n" +
  "### Guidelines\n" +
  " - The audience of this summary is a home gardener who has just created a garden plan and is seeing it for the first time. Be informative and engaging, and not too verbose." +
  " - Reference specific crops or varieties included in their plan.\n" +
  " - Focus on chronological growing and harvesting events, so that the summary reads a bit like a very short story about the harvests of the year to come.\n" +
  // " - Focus on how the types, timings, and durations of harvests will affect the overall garden production throughout the year." +
  // I think this one is good ^ because the user should get a verbal summary of what the crops will be like. But, one example showed things coming out of order a bit. It should read like a very short story.
  // " - The user, a home vegetable gardener, is the audience. Be informative but not too formal.\n" +
  // " - Do not explain the purpose of the plan. This will be explained in an earlier paragraph.\n" +
  // " - Do not mention what year the plan takes place in.\n" +
  " - Don't give instructions—this will be covered in other parts of the plan.\n" +
  " - Don't repeat the names of crop varieties.\n" +
  " - Do not repeat information from the `Introduction Paragraph`, listed below\n" +
  "\n" +
  "### Introduction Paragraph\n" +
  "Your 2025 planting schedule optimizes the productivity of your garden by timing when to plant and harvest each crop. The color-coded diagram shows where each crop belongs, and some crops are scheduled to follow others in the same areas—a method called succession planting that maximizes space by staggering planting times.\n" +
  "\n"

const getUserPrompt = (climateData: string, cropData: string) =>
  "**Climate Data:**\n" +
  "```" +
  climateData +
  "```" +
  "\n" +
  "**Crop Data:**\n" +
  "```" +
  cropData +
  "```"
