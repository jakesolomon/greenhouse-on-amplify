import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { env } from '$amplify/env/getFullPlanContent';
import { Logger } from "@aws-lambda-powertools/logger";
import { Schema } from "../../data/resource";

// THIS ENDPOINT IS DEPRECATED. USE individual endpoints getFullPlanIntroExtras, getFullPlanSummaries, getFullPlanTasks

// These types adhere to the response format in /src/types.ts

interface GrowingDateRange {
  transplantingDate: Date
  harvestStartDate: Date
  harvestEndDate: Date
}

interface Crop {
  name: string;
  variety: string;
  shortDescription: string;
  storeHandle?: string;
  imageUrl?: string;

  optimalGrowingDateRanges: GrowingDateRange[]
  frostHardy: boolean;
  directSow: boolean;
  guidance: string;

  lowerTempBound: number;
  upperTempBound: number;
}

interface Planting {
  name: string;
  transplantingDate: Date;
  harvestStartDate: Date;
  harvestEndDate: Date;
}

interface AppendedPlanting extends Planting {
  directSow: boolean;
}

const IntroExtrasOutput = z.object({
  pruning: z.string(),
  supportStructures: z.string()
});

const TasksOutput = z.object({
  January: z.array(z.string()),
  February: z.array(z.string()),
  March: z.array(z.string()),
  April: z.array(z.string()),
  May: z.array(z.string()),
  June: z.array(z.string()),
  July: z.array(z.string()),
  August: z.array(z.string()),
  September: z.array(z.string()),
  October: z.array(z.string()),
  November: z.array(z.string()),
  December: z.array(z.string()),
});

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

const logger = new Logger({ serviceName: "getFullPlanContent" });

const openai = new OpenAI({
  apiKey: env.API_KEY
});

const callLLM = async (
  systemPrompt: string,
  userPrompt: string,
  responseFormat: typeof IntroExtrasOutput | typeof TasksOutput | typeof SummariesOutput,
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
  annotatedTasks: { plot: number; crop: string; tasks: Record<string, string[]> }[]
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

export const handler: Schema["getFullPlanContent"]["functionHandler"]  = async (event) => {

  const { crops, plantingSchedule, climateData, companionPlantingAdvice } = event.arguments

  // logger.info("Calling LLM endpoint for introExtras with userPrompt: ", introExtrasUserPrompt(JSON.parse(crops)))
  logger.info("Calling LLM endpoint for introExtras.")

  const introExtras = await callLLM(
    introExtrasSystemPrompt,
    introExtrasUserPrompt(JSON.parse(crops)),
    IntroExtrasOutput,
    "intro_extras_output"
  )
  const introExtrasOutput = JSON.parse(introExtras.choices[0].message.content!);

  const cropsParsed: Crop[] = JSON.parse(crops)
  const plantingScheduleParsed: Planting[][] = JSON.parse(plantingSchedule)
  const appendedPlantingSchedule: AppendedPlanting[][] = plantingScheduleParsed.map(plot => {
    return plot.map(planting => ({
      ...planting,
      directSow: cropsParsed.find(crop => crop.name === planting.name)!.directSow
    }))
  })
  const taskPromises = appendedPlantingSchedule.flatMap((plot, plotIndex) => {
    return plot.map(async (planting, plantingIndex) => {

      // logger.info("Calling LLM endpoint for tasks with userPrompt: ", tasksUserPrompt(planting, climateData, plot[plantingIndex + 1]))
      logger.info("Calling LLM endpoint for tasks.")

      const tasks = await callLLM(
        tasksSystemPrompt,
        tasksUserPrompt(planting, climateData, plot[plantingIndex + 1]),
        TasksOutput,
        "tasks_output"
      );

      const tasksOutputRaw = tasks.choices[0].message.content; // Assuming `content` is a string
      const tasksOutput = JSON.parse(tasksOutputRaw!); // Convert from JSON string to an object

      return { plot: plotIndex + 1, crop: planting.name, tasks: tasksOutput };
    });
  });

  const allTasks = await Promise.all(taskPromises)

  // logger.info("Calling LLM endpoint for summaries with userPrompt: ", summariesUserPrompt(allTasks, companionPlantingAdvice, climateData))
  logger.info("Calling LLM endpoint for summaries.")

  const summaries = await callLLM(
    summariesSystemPrompt,
    summariesUserPrompt(allTasks, companionPlantingAdvice, climateData),
    SummariesOutput,
    "summaries_output"
  )
  const summariesOutput = JSON.parse(summaries.choices[0].message.content!);

  return JSON.stringify({
    introExtras: introExtrasOutput,
    allTasks: allTasks,
    summaries: summariesOutput
  })
};

const introExtrasSystemPrompt =
  "You are a helpful gardening assistant, tasked with writing a clear and informative step-by-step garden plan for a beginner gardener. Using the provided information on the crop variety being used, and the climate in which the gardener will be growing, write guidance on how how the following two tasks come into play in the gardener's plan: pruning, support structures.\n" +
  "\n" +
  "***Guidelines***\n" +
  " - Aim for one paragraph of guidance per each section.\n" +
  " - Be specific as to how each task type affects the crops in the plan—how to execute, and what benefits the task will offer.\n" +
  " - If none of the crops provided require the use of one or both of the tasks, simply return an empty string for that task's output. (For example, if none of the crops require pruning, just return an empty string for the pruning output).\n" +
  "\n"

const introExtrasUserPrompt = (crops: Crop[]) =>
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

const tasksSystemPrompt =
  "You are a helpful gardening assistant, tasked with writing a clear and informative step-by-step garden plan for a beginner gardener. Using the provided information on the crop variety being used, and the climate in which the gardener will be growing, write a full todo list of activities to grow the crop from seed, all the way through the full duration of harvest. (Note that climate data are estimates, not perfectly reliable predictions.) Do not skip any step at all: for example, include detailed instructions for germination, growing seedlings, suggestions for grow lights or natural light, use of fans for strengthening seedlings, hardening off seedlings, transplanting into an outdoor garden, watching for common issues, etc.\n" +
  "\n" +
  "***Guidelines***\n" +
  "- Adhere to the timing milestones provided under \"Crop Information\". For activities that occur before transplanting, make sure they begin at the appropriate time leading up to transplanting date. For example, if a crop has a provided transplanting date of September 1st and takes one month to mature from germination, provide instructions to begin germinating seeds on August 1st.\n" +
  "- Mention any common issues that may occur when the timing is relevant. For any issue, give tips on what to watch for and what solutions may be used. For example, if an issue may present itself during the seedling state, list it as a task during the month when the plant is a seedling.\n" +
  "- In general, explain the reasoning behind tasks. But especially for optional suggestions, provide context as to why the suggestion is made and what the user can expect if they do not follow it (or do not have the means to follow it). For example, if suggesting to use grow lights to grow seedlings, explain how the grow lights benefit the plant, what problems may occur if the grow light is not used, and if there are other options a user may proceed with to remedy those issues if not using a grow light.\n" +
  "- Separate your tasks by month. Give some indication as to when the tasks should be carried out, but also indicate where there should be some flexibility in timing by indicating if tasks should be determined by other factors (e.g. wait for outdoor temps to reach xxx before transplanting seedlings).\n" +
  "- Do not include information about buying seeds or how to select an outdoor location to grow, as both of these aspects will be covered in a different section of the garden plan.\n" +
  "- Because the audience is a beginner gardener, feel free to use garden-specific terminology, but explain the meaning of terms that users may not be familiar with.\n" +
  "- The output parameter \"indoors\" is a boolean that represents whether or not that month's tasks take place before the crop has been transplanted outdoors. Mark as \"true\" if the tasks for that month pertain to growing seedlings indoors, mark as \"false\" in any other case.\n" +
  "- Append any tasks that take place before the crop has been transplanted outdoors with ***indoors*** at the beginning of the string to indicate that the plant is in seedling stage. For example: \"***indoors*** Start tomato seeds indoors approximately 6-8 weeks before the outdoor planting date ...\"\n" +
  "\n" +
  "***Example Output***\n" +
  "{\n" +
  "    \"January\": [],\n" +
  "    \"February\": [],\n" +
  "    \"March\": [\n" +
  "      \"***indoors***Start tomato seeds indoors approximately 6-8 weeks before the outdoor planting date (around March 15). Use seed-starting trays filled with seed starting mix, which is lighter and drains better than regular potting soil. Sow seeds 1/4 inch deep.\",\n" +
  "      \"***indoors***Provide a consistent temperature of around 70°F-75°F for germination. If your home is cooler, consider using a seedling heat mat under the trays to speed up germination. Without adequate warmth, seeds may germinate slowly or not at all.\",\n" +
  "      \"***indoors***Place the seedlings under grow lights or in a south-facing window where they will receive at least 12-16 hours of light daily. If you're using natural light, be aware that insufficient light can cause leggy seedlings (tall, weak stems), so grow lights are advisable. If unable to use grow lights, try to rotate the seedlings to get even sunlight access throughout the day.\",\n" +
  "      \"***indoors***Monitor for signs of damping off (a fungal disease that can kill seedlings). Symptoms include a sudden toppling of seedlings. To prevent this, ensure good airflow around your seedlings by using a small fan to keep air circulating around the plants.\"\n" +
  "],\n" +
  "    \"April\": [\n" +
  "      \"***indoors***As it gets warmer, ensure that indoor tomato seedlings are kept in pots that are watered thoroughly but do not allow them to become waterlogged. Watch for signs of overwatering such as yellow leaves. If leaves are dropping and the soil is wet, reduce watering frequency.\",\n" +
  "      \"***indoors***Harden off tomato seedlings by gradually exposing them to outdoor conditions over a week before transplanting. Start with a few hours of indirect sunlight on a mild day and increase their outdoor time progressively.\",\n" +
  "      \"Prepare garden beds where tomatoes will be transplanted by clearing old plants and weeds, then enrich the soil with compost to improve nutrients.\"\n" +
  "    ],\n" +
  "    \"May\": [\n" +
  "      \"Approximate outdoor transplant date is May 25; check the weather forecast, and ensure there is no risk of late frost before planting outside.\",\n" +
  "      \"***indoors***Harden off the seedlings for 1-2 weeks before transplanting. Gradually introduce them to outdoor conditions by placing them outside for a few hours each day, increasing the duration daily.\",\n" +
  "      \"Transplant tomato seedlings outdoors around May 19 after hardening off is complete and your outdoor soil temperature consistently reaches about 60°F. Space the seedlings about 24-36 inches apart to allow space for growth. Bury the stems of the seedlings deep in the soil to encourage robust root development.\",\n" +
  "      \"Monitor newly transplanted tomato plants for transplant shock (droopy leaves, stunted growth). Water them well after transplanting and continue regular watering to help them adjust.\"\n" +
  "    ],\n" +
  "    \"June\": [\n" +
  "      \"Continue to water plants consistently, providing about 1-2 inches of water per week.\",\n" +
  "      \"Apply mulch around the base of the plants to help retain moisture and suppress weeds.\",\n" +
  "      \"Regularly inspect plants for pests such as hornworms or signs of disease. Use organic solutions like neem oil for pest control if needed.\"\n" +
  "    ],\n" +
  "    \"July\": [\n" +
  "      \"Monitor for blossom end rot, which appears as black spots on the bottom of tomatoes; this is often due to inconsistent watering or calcium deficiency. Ensure consistent moisture levels and consider adding lime to your soil if calcium is low.\",\n" +
  "      \"Continue watering and weeding, ensuring plants have enough nutrients.\"\n" +
  "    ],\n" +
  "    \"August\": [\n" +
  "      \"Tomatoes should be producing fruit. Harvest ripe tomatoes regularly to encourage more fruit production.\",\n" +
  "      \"Continue to monitor for pests and diseases, removing any affected leaves or fruit and treating as necessary.\"\n" +
  "    ],\n" +
  "    \"September\": [\n" +
  "      \"Finish harvesting tomatoes by September 13 and begin removing the plants to make space for kale.\"\n" +
  "    ],\n" +
  "    \"October\": [],\n" +
  "    \"November\": [],\n" +
  "    \"December\": []\n" +
  "  }\n"

const tasksUserPrompt = (planting: AppendedPlanting, climateData: string, nextPlanting?: AppendedPlanting) =>
  `${
    nextPlanting &&
    "***Extra Guidelines***\n" +
    ` - The user's plan will include planting ${nextPlanting.name} into this same area around ${nextPlanting.transplantingDate}, so instruct the user to finish the harvest of ${planting.name} and remove these plants on the specified harvestEndDate, in order to make room for ${nextPlanting.name}. Do not include any instructions that take place after this date.\n`
  }\n` +
  "***Crop Information***\n" +
  "{\n" +
    `name: ${planting.name},\n` +
    `plantingMethod: ${planting.directSow},\n` +
    `transplantingDate: ${planting.transplantingDate}\n` +
    `harvestStartDate: ${planting.harvestStartDate}\n` +
    `harvestEndDate: ${planting.harvestEndDate}\n` +
  "}\n" +
  "\n" +
  "***Climate Information***\n" +
  {climateData}

const summariesSystemPrompt =
  "You are a helpful gardening assistant, tasked with writing a clear and informative step-by-step garden plan for a beginner gardener. Using the provided task lists for each month (which indicate what crops the user will be growing and when), the climate in which the gardener will be growing, and some suggested companion plants for each crop, write a summary of the gardener’s experience for each month. Give information about what kind of work the gardener will put in, the kinds of weather changes they may expect and how those will influence the growth of their garden, what harvests they can expect to continue or watch for, and any other information or suggestions that the gardener may find useful or exciting as they read about the coming month.\n" +
  "\n" +
  "***Guidelines***\n" +
  " - Only summarize months that have tasks associated with them in the “Task Schedule”. Other months will not be included in the plan at all.\n" +
  " - Include instructions on growing the companion plants mentioned in “Companion Planting Advice”.\n" +
  " - Make sure that companion plants are planted early enough to allow them to reach the maturity required for their specific benefits to take effect when needed. (e.g. Crop A can benefit from growing near Companion Herb A while Companion Herb A goes to flower. Crop A will be planted in August, and Companion Herb A requires ninety days to come to maturity. Give instructions in the June summary to being growing Companion Herb A so that it will arrive at its useful stage while Crop A is growing.\n" +
  " - Aim for a maximum length of 120 words. Try to include important information, but avoid flowery language in order to stay concise.\n"

const summariesUserPrompt = (
  tasksData: { plot: number; crop: string; tasks: Record<string, string[]> }[],
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