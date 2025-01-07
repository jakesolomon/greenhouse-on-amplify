import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { env } from '$amplify/env/getCropData';

import { Schema } from "../../data/resource";

// These types adhere to the response format in /src/types.ts

const Crop = z.object({
  name: z.string(),
  variety: z.string(),
  reason: z.string(),
  seedlingDuration: z.number().int(),
  growthDuration: z.number().int(),
  harvestDuration: z.number().int(),
  lowerTempBound: z.number().int(),
  upperTempBound: z.number().int(),
});

const CropDataOutput = z.object({
  summary: z.string(),
  crops: z.array(Crop),
  additionalAdvice: z.array(z.string()),
});

export const handler: Schema["getCropData"]["functionHandler"]  = async (event) => {

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
    response_format: zodResponseFormat(CropDataOutput, "crop_data_output"),
  });

  const overviewOutput = completion.choices[0].message;
  if (overviewOutput.refusal) {
    console.log(overviewOutput.refusal);
  }

  return overviewOutput.content;
};
