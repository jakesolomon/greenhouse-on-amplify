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
  "You are a gardening assistant tasked with creating planting schedules for the year 2025 that maximize harvests and meet user-defined goals. Below is a summary of predicted climate conditions, and a set of crops and varieties that have been selected to use in a user's gardening plan. Provide a 40-55 word summary of what the gardener can expect in both growing and harvesting.\n" +
  "\n" +
  "### Guidelines\n" +
  "- This is a singular user receiving this plan, so the summary should reinforce the fact that their plan has been tailored specifically to their preferences. You can do this by referencing specific crops or varieties included in their plan.\n" +
  "- The user, a home vegetable gardener, is the audience. Be informative but not too formal.\n" +
  "- Do not explain the purpose of the plan. This will be explained in an earlier paragraph.\n" +
  "- Do not mention what year the plan takes place in.\n" +
  "- Don't give instructions—this will be covered in other parts of the plan.\n" +
  "- Don't repeat the names of crop varieties.\n" +
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
