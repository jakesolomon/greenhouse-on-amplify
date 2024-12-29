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
  summary: z.string(),
  plots: z.array(z.array(Planting)),
});

export const handler: Schema["getPlantingScheduleData"]["functionHandler"]  = async (event) => {

  const openai = new OpenAI({
    apiKey: env.API_KEY
  });
  const { prompt } = event.arguments
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      { role: "user", content: prompt! }
    ],
    response_format: zodResponseFormat(PlantingScheduleOutput, "planting_schedule_output"),
  });

  const plantingScheduleOutput = completion.choices[0].message;
  if (plantingScheduleOutput.refusal) {
    console.log(plantingScheduleOutput.refusal);
  }

  return plantingScheduleOutput.content;
};