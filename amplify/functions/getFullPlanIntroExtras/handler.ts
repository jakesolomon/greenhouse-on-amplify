import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { env } from '$amplify/env/getFullPlanContent';
import { Logger } from "@aws-lambda-powertools/logger";
import { Schema } from "../../data/resource";

// These types adhere to the response format in /src/types.ts

interface CropDataForFullPlanRequests {
  name: string;
  variety: string;
  directSow: boolean;
}

const IntroExtrasOutput = z.object({
  pruning: z.string(),
  supportStructures: z.string()
});

const logger = new Logger({ serviceName: "getFullPlanIntroExtras" });

const openai = new OpenAI({
  apiKey: env.API_KEY
});

const callLLM = async (
  systemPrompt: string,
  userPrompt: string,
  responseFormat: typeof IntroExtrasOutput,
  responseFormatName: string
) => {
  return openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {role: "system", content: systemPrompt},
      {role: "user", content: userPrompt}
    ],
    response_format: zodResponseFormat(responseFormat, responseFormatName),
  });
}

export const handler: Schema["getFullPlanIntroExtras"]["functionHandler"]  = async (event) => {

  const { crops } = event.arguments

  logger.info("Calling LLM endpoint for introExtras with userPrompt: ", introExtrasUserPrompt(JSON.parse(crops)))
  // logger.info("Calling LLM endpoint for introExtras.")

  const introExtras = await callLLM(
    introExtrasSystemPrompt,
    introExtrasUserPrompt(JSON.parse(crops)),
    IntroExtrasOutput,
    "intro_extras_output"
  )
  return introExtras.choices[0].message.content!;
};

const introExtrasSystemPrompt =
  "You are a helpful gardening assistant, tasked with writing a clear and informative step-by-step garden plan for a beginner gardener. Using the provided information on the crop variety being used, and the climate in which the gardener will be growing, write guidance on how how the following two tasks come into play in the gardener's plan: pruning, support structures.\n" +
  "\n" +
  "***Guidelines***\n" +
  " - Aim for one paragraph of guidance per each section.\n" +
  " - Be specific as to how each task type affects the crops in the plan—how to execute, and what benefits the task will offer.\n" +
  " - If none of the crops provided require the use of one or both of the tasks, simply return an empty string for that task's output. (For example, if none of the crops require pruning, just return an empty string for the pruning output).\n" +
  "\n"

const introExtrasUserPrompt = (crops: CropDataForFullPlanRequests[]) =>
  "***Crop Information***\n" +
  "```\n" +
  crops.map(crop =>
    "{\n" +
    `name: ${crop.name},\n` +
    `variety: ${crop.variety},\n` +
    `sowingMethod: ${crop.directSow ? "Direct Sow" : "Transplant seedlings"}\n` +
    "},\n"
  ) +
  "```"
