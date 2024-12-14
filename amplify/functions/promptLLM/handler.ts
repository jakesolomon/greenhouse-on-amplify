import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { env } from '$amplify/env/promptLLM';

import { Schema } from "../../data/resource";

// These types adhere to the response format in /src/types.ts

const PlantingDateSchema = z.object({
  month: z.number().int(), // Limits month to values between 1 and 12
  day: z.number().int(),   // Limits day to values typically accepted in a calendar month
});

const Crop = z.object({
  name: z.string(),
  variety: z.string(),
  reason: z.string(),
  plantingDate: PlantingDateSchema,
  harvestDate: PlantingDateSchema,
});

const OverviewOutput = z.object({
  summary: z.string(),
  crops: z.array(Crop),
  additionalAdvice: z.array(z.string()),
});

export const handler: Schema["promptLLM"]["functionHandler"]  = async (event) => {

  const openai = new OpenAI({
    apiKey: env.API_KEY
  });
  const { prompt } = event.arguments
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      // Most examples have a "system" prompt and then a "user" prompt. Whats the difference? Why not just have it all in one?
      // https://platform.openai.com/docs/guides/structured-outputs?lang=node.js&context=ex2#how-to-use
      { role: "user", content: prompt! }
    ],
    response_format: zodResponseFormat(OverviewOutput, "overview_output"),
  });

  const overviewOutput = completion.choices[0].message;
  if (overviewOutput.refusal) {
    console.log(overviewOutput.refusal);
  }

  return overviewOutput.content;
};