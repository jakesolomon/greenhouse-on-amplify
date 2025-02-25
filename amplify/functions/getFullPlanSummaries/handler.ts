import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { env } from '$amplify/env/getFullPlanContent';
import { Logger } from "@aws-lambda-powertools/logger";
import { Schema } from "../../data/resource";

// These types adhere to the response format in /src/types.ts

interface AnnotatedTaskList {
  plot: number; crop: string; tasks: Record<string, string[]>
}

const SummariesOutput = z.object({
  January: z.string(),
  February: z.string(),
  March: z.string(),
  April: z.string(),
  May: z.string(),
  June: z.string(),
  July: z.string(),
  August: z.string(),
  September: z.string(),
  October: z.string(),
  November: z.string(),
  December: z.string(),
});

const logger = new Logger({ serviceName: "getFullPlanSummaries" });

const openai = new OpenAI({
  apiKey: env.API_KEY
});

const callLLM = async (
  systemPrompt: string,
  userPrompt: string,
  responseFormat: typeof SummariesOutput,
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

const formatTasksForLLM = (
  annotatedTasks: AnnotatedTaskList[]
): string => {
  const formatted: Record<string, Record<string, Record<string, string[]>>> = {};

  for (const { plot, crop, tasks: taskByMonth } of annotatedTasks) {
    for (const [month, taskList] of Object.entries(taskByMonth)) {
      if (taskList.length === 0) continue; // Skip months with no tasks

      if (!formatted[month]) {
        formatted[month] = {};
      }

      const locationKeys = taskList.map(task => task.startsWith('***indoors***') ? 'Seedling Station' : `Plot ${plot}`);

      for (const [index, task] of taskList.entries()) {
        const cleanTask = task.replace('***indoors***', '').trim();
        const targetLocation = locationKeys[index];

        if (!formatted[month][targetLocation]) {
          formatted[month][targetLocation] = {};
        }

        if (!formatted[month][targetLocation][crop]) {
          formatted[month][targetLocation][crop] = [];
        }

        formatted[month][targetLocation][crop].push(cleanTask);
      }
    }
  }

  return Object.entries(formatted)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, locations]) =>
      Object.values(locations).some(crops =>
        Object.values(crops).some(tasks => tasks.length > 0))
    )
    .map(([month, locations]) => {
      const locationStr = Object.entries(locations)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, crops]) =>
          Object.values(crops).some(tasks => tasks.length > 0)
        )
        .map(([location, crops]) => {
          const cropStr = Object.entries(crops)
            .map(([crop, tasks]) => {
              const taskStr = tasks.map(task => `      - ${task}`).join('\n');
              return `    ${crop}\n${taskStr}`;
            })
            .join('\n\n');
          return `  ${location}\n${cropStr}`;
        })
        .join('\n\n');

      return `${month}\n${locationStr}`;
    })
    .join('\n\n');
}

export const handler: Schema["getFullPlanSummaries"]["functionHandler"]  = async (event) => {

  const { tasks, climateData, companionPlantingAdvice } = event.arguments
  const parsedTasks: AnnotatedTaskList[] = JSON.parse(tasks)

  logger.info("Calling LLM endpoint for summaries with userPrompt: ", summariesUserPrompt(parsedTasks, companionPlantingAdvice, climateData))
  // logger.info("Calling LLM endpoint for summaries.")

  const summaries = await callLLM(
    summariesSystemPrompt,
    summariesUserPrompt(parsedTasks, companionPlantingAdvice, climateData),
    SummariesOutput,
    "summaries_output"
  )
  return summaries.choices[0].message.content!;
};

const summariesSystemPrompt =
  "You are a helpful gardening assistant, tasked with writing a clear and informative step-by-step garden plan for a beginner gardener. Using the provided task lists for each month (which indicate what crops the user will be growing and when), the climate in which the gardener will be growing, and some suggested companion plants for each crop, write a summary of the gardener’s experience for each month. Give information about what kind of work the gardener will put in, the kinds of weather changes they may expect and how those will influence the growth of their garden, what harvests they can expect to continue or watch for, and any other information or suggestions that the gardener may find useful or exciting as they read about the coming month.\n" +
  "\n" +
  "***Guidelines***\n" +
  " - Only summarize months that have tasks associated with them in the “Task Schedule”. Other months will not be included in the plan at all.\n" +
  " - Include instructions on growing the companion plants mentioned in “Companion Planting Advice”.\n" +
  " - Make sure that companion plants are planted early enough to allow them to reach the maturity required for their specific benefits to take effect when needed. (e.g. Crop A can benefit from growing near Companion Herb A while Companion Herb A goes to flower. Crop A will be planted in August, and Companion Herb A requires ninety days to come to maturity. Give instructions in the June summary to being growing Companion Herb A so that it will arrive at its useful stage while Crop A is growing.\n" +
  " - Aim for a maximum length of 120 words. Try to include important information, but avoid flowery language in order to stay concise.\n"

const summariesUserPrompt = (
  tasksData: AnnotatedTaskList[],
  companionPlantingAdvice: string,
  climateInformation: string
) =>
  "***Task Schedule***\n" +
  "```\n" +
  formatTasksForLLM(tasksData) +
  "`\n```\n\n" +
  "***Companion Planting Advice***\n" +
  "```\n" +
  {companionPlantingAdvice} +
  "\n```\n\n" +
  "***Climate Information***\n" +
  "```\n" +
  {climateInformation} +
  "\n```"