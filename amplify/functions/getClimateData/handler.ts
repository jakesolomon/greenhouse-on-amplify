import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { env } from '$amplify/env/getCropData';
import { Logger } from "@aws-lambda-powertools/logger";

import { Schema } from "../../data/resource";

// These types adhere to the response format in /src/types.ts

const TemperatureData = z.object({
  avgHigh: z.number(),
  avgLow: z.number(),
});

const TemperatureDataByMonth = z.object({
  month: z.string(),
  temps: TemperatureData
});

// const TemperatureDataByMonth = z.object({
//   january: TemperatureData,
//   february: TemperatureData,
//   march: TemperatureData,
//   april: TemperatureData,
//   may: TemperatureData,
//   june: TemperatureData,
//   july: TemperatureData,
//   august: TemperatureData,
//   september: TemperatureData,
//   october: TemperatureData,
//   november: TemperatureData,
//   december: TemperatureData,
// });

const ClimateDataOutput = z.object({
  temperatureData: z.array(TemperatureDataByMonth),
  lastFrostDate: z.string(),
  firstFrostDate: z.string(),
  hardinessZone: z.number(),
});

const logger = new Logger({ serviceName: "getClimateData" });

export const handler: Schema["getClimateData"]["functionHandler"]  = async (event) => {

  const openai = new OpenAI({
    apiKey: env.API_KEY
  });
  const { zipCode } = event.arguments
  const prompt =
    `For the zip code "${zipCode}": What are the average temperature highs and lows, in fahrenheit, for every month? Also provide the estimated last frost date of the spring, and first frost date of the autumn, formatted as "MonthName Day". And lastly, based on the location, provide the USDA Plant Hardiness Zone as a number.`
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    temperature: 0,
    top_p: 0,
    messages: [
      { role: "user", content: prompt }
    ],
    response_format: zodResponseFormat(ClimateDataOutput, "climate_data_output"),
  });

  const overviewOutput = completion.choices[0].message;
  if (overviewOutput.refusal) {
    logger.error("Climate data request to LLM refused.", overviewOutput.refusal);
  }

  return overviewOutput.content;
};
