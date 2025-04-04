import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { env } from '$amplify/env/getFullPlanContent';
import { Logger } from "@aws-lambda-powertools/logger";
import { Schema } from "../../data/resource";

// THIS ENDPOINT IS DEPRECATED. handleStripePurchase now includes all LLM calls for Monthly Plan content.

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
    model: "gpt-4o-mini",
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
  const startTime = performance.now();

  const summaries = await callLLM(
    summariesSystemPrompt,
    summariesUserPrompt(parsedTasks, companionPlantingAdvice, climateData),
    SummariesOutput,
    "summaries_output"
  )

  const endTime = performance.now();
  const duration = endTime - startTime;
  logger.info(`API calls to getFullPlanSummaries took ${duration} milliseconds.`);

  return summaries.choices[0].message.content!;
};

const summariesSystemPrompt =
  "You are a helpful gardening assistant, tasked with writing a clear and informative step-by-step garden plan for a beginner gardener. Using the provided task lists for each month (which indicate what crops the user will be growing and when), the climate in which the gardener will be growing, and some suggested companion plants for each crop, write a summary of the gardener’s experience for each month. Give information about what kind of work the gardener will put in, the kinds of weather changes they may expect and how those will influence the growth of their garden, what harvests they can expect to continue or watch for, and any other information or suggestions that the gardener may find useful or exciting as they read about the coming month.\n" +
  "\n" +
  "***Guidelines***\n" +
  " - Only summarize months that have tasks associated with them in the “Task Schedule”. Other months will not be included in the plan at all.\n" +
  " - Include instructions on growing the companion plants mentioned in “Companion Planting Advice”.\n" +
  " - Make sure that companion plants are planted early enough to allow them to reach the maturity required for their specific benefits to take effect when needed. (e.g. Crop A can benefit from growing near Companion Herb A while Companion Herb A goes to flower. Crop A will be planted in August, and Companion Herb A requires ninety days to come to maturity. Give instructions in the June summary to being growing Companion Herb A so that it will arrive at its useful stage while Crop A is growing.\n" +
  " - Aim for a maximum length of 120 words. Try to include important information, but avoid flowery language in order to stay concise.\n" +
  "\n" +
  "***Example Output***\n" +
  "{\n" +
  "  \"January\": \"\",\n" +
  "  \"February\": \"\",\n" +
  "  \"March\": \"\",\n" +
  "  \"April\": \"In April, begin starting snap peas and radishes indoors in seed trays, ensuring optimal light and temperature. For peas, maintain soil temperature at 65°F-70°F, using a seedling heat mat if needed. Ensure seeds get 12-16 hours of light daily to prevent leggy growth. For radishes, sow seeds 1/2 inch deep and provide consistent warmth with 12-14 hours of light. Outdoors, transplant radish seedlings around April 10 after ensuring no risk of frost and maintaining soil temperature around 50°F. Space them properly to ensure good air circulation and root development, watering thoroughly to reduce transplant shock.\",\n" +
  "  \"May\": \"May is a busy month as you start broccoli and tomato seeds indoors, using seed-starting trays and maintaining temperatures of 65°F-70°F for broccoli, and 70°F-80°F for tomatoes. Ensure 12-16 hours of light to prevent leggy seedlings. Transplant snap pea seedlings into Plot 2 early in May, ensuring adequate spacing. Prepare Plot 3 for radish transplants and continue harvesting any remaining indoor-grown crops. Water all new transplants thoroughly to help them settle. This month involves a lot of transitioning plants from indoors to your garden plots, requiring careful monitoring of light and moisture levels.\",\n" +
  "  \"June\": \"Continue caring for tomato seedlings indoors, maintaining consistent moisture and light. Begin hardening them off in early June. In Plot 2, finish harvesting snap peas by June 15, then clear the area for corn planting. Monitor and water radishes in Plot 3 to promote sustainable growth. Start corn in Seedling Station early, transplanting mid-June once snap peas are cleared. Monitor all seedlings for pests or diseases. Consistent watering and daily checks for pests will ensure healthy growth.\",\n" +
  "  \"July\": \"Transplant broccoli into Plot 1 on July 1, ensuring consistent moisture and using mulch to retain it and reduce weeds. Begin harvesting broccoli heads around July 10. Continue to care for cauliflower seedlings indoors, starting 6-8 weeks before transplant with consistent light and temperature control. In Plot 3, monitor and care for newly planted tomatoes, mulching and watering appropriately. Harvest radishes regularly for continuous production through July; ensure spacing once plants mature for the best yields.\",\n" +
  "  \"August\": \"Transplant cauliflower into Plot 1 by August 27 after hardening off. Begin tomato harvesting in Plot 3 by August 5, monitoring for issues like blossom end rot. Start kale indoors, ensuring temperature control and adequate lighting. As snap peas finish, prepare Plot 2 for corn transplant. Consistent watering and close monitoring of pest problems across all plots will ensure health and maximize yields. These actions will provide a solid transition into autumn plantings.\",\n" +
  "  \"September\": \"End tomato harvesting by September 10 before clearing Plot 3 for radish planting. Transplant kale in Plot 2 by September 7, maintaining consistent watering and monitoring for pests. Mulch around cauliflower in Plot 1 to retain moisture and support developing heads. Watch for corn pests, harvesting by September 5 and preparing the plot for kale. Manage radish seedlings indoors for transplanting later in the month in Plot 3. Regular checks and maintenance will ensure healthy, productive plants.\",\n" +
  "  \"October\": \"Harvest mature radishes in Plot 3, attending to companion plant needs based on growth stages. In Plot 1, continue regular checks on cauliflower, using balanced fertilizers to support head development. Keep kale in Plot 2 well-watered and mulched to protect roots and suppress weeds. Insect monitoring and use of organic treatments when necessary will keep your plants healthy. Cooler temperatures may help your plants become robust as they continue to grow and produce.\",\n" +
  "  \"November\": \"Harvest cauliflower heads in Plot 1 by November 15-22, cutting stems carefully. Watch for frost and cover plants if needed. Harvest kale from Plot 2 regularly from November 11, as cool weather can enhance sweetness. Post-harvest, remove debris to prevent disease, and enrich soil with compost. Check and maintain radish growth in Plot 3, ensuring enough space to prevent overcrowding. Caution with pests will prevent crop damage and maintain plant health.\",\n" +
  "  \"December\": \"\"\n" +
  "}\n\n"

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