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

interface Planting {
  name: string;
  transplantingDate: Date;
  harvestStartDate: Date;
  harvestEndDate: Date;
}

interface AppendedPlanting extends Planting {
  directSow: boolean;
}

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

const logger = new Logger({ serviceName: "getFullPlanTasks" });

const openai = new OpenAI({
  apiKey: env.API_KEY
});

const callLLM = async (
  systemPrompt: string,
  userPrompt: string,
  responseFormat: typeof TasksOutput,
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

export const handler: Schema["getFullPlanTasks"]["functionHandler"]  = async (event) => {

  const { crops, plantingSchedule, climateData } = event.arguments

  const cropsParsed: CropDataForFullPlanRequests[] = JSON.parse(crops)
  const plantingScheduleParsed: Planting[][] = JSON.parse(plantingSchedule)
  const appendedPlantingSchedule: AppendedPlanting[][] = plantingScheduleParsed.map(plot => {
    return plot.map(planting => ({
      ...planting,
      directSow: cropsParsed.find(crop => crop.name === planting.name)!.directSow
    }))
  })
  const startTime = performance.now();
  const taskPromises = appendedPlantingSchedule.flatMap((plot, plotIndex) => {
    return plot.map(async (planting, plantingIndex) => {

      logger.info("Calling LLM endpoint for tasks with userPrompt: ", tasksUserPrompt(planting, climateData, plot[plantingIndex + 1]))
      // logger.info("Calling LLM endpoint for tasks.")

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
  const endTime = performance.now();
  const duration = endTime - startTime;
  logger.info(`API calls to getFullPlanTasks took ${duration} milliseconds.`);

  return JSON.stringify(allTasks)
};

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
  "- The month outputs represent months of the year 2025. So for overwintering plantings (i.e. harvestStartDate and/or harvestEndDate in 2026), do not include any tasks that would take place after December 2025. For example, if garlic is to be planted in September and harvested the following May, provide instructions through December 2025, and do not provide any tasks for January—May. If this means that you don't provide tasks that range from start to harvest, simply summarize the remainder of the tasks in your latest included month.\n" +
  "\n" +
  "***Example Output***\n" +
  "[\n" +
  "  {\n" +
  "    \"plot\": 1,\n" +
  "    \"crop\": \"Broccoli\",\n" +
  "    \"tasks\": {\n" +
  "      \"January\": [],\n" +
  "      \"February\": [],\n" +
  "      \"March\": [\n" +
  "        \"***indoors*** Start broccoli seeds indoors approximately 6-8 weeks before the outdoor transplanting date, which is around March 1. Use seed-starting trays and a seed starting mix to provide optimal conditions for germination. Sow seeds about 1/4 inch deep.\",\n" +
  "        \"***indoors*** Maintain a consistent soil temperature of around 65°F-70°F to encourage germination. Using a seedling heat mat can help if room temperatures are too low.\",\n" +
  "        \"***indoors*** Place the broccoli seedlings under grow lights or in a location with plenty of natural sunlight, aiming for 12-16 hours of light daily. Grow lights help prevent leggy seedlings, which are weak and spindly from insufficient light. If relying on windows, rotate trays to ensure even light distribution.\"\n" +
  "      ],\n" +
  "      \"April\": [\n" +
  "        \"***indoors*** Continue to care for broccoli seedlings by maintaining consistent moisture without waterlogging. Watch for symptoms of damping off, such as sudden wilting of seedlings, and ensure good airflow with a small fan to prevent this fungal issue.\",\n" +
  "        \"***indoors*** Begin hardening off the seedlings at the end of April, about 1-2 weeks before the transplanting date. Gradually introduce them to outdoor conditions, starting with a few hours of shade and slowly increasing sunlight exposure.\"\n" +
  "      ],\n" +
  "      \"May\": [\n" +
  "        \"Transplant broccoli seedlings into the garden around May 1 after hardening off is complete, ensuring no risk of frost. Space them about 18-24 inches apart in rows 24-36 inches apart for optimal growth.\",\n" +
  "        \"Water the newly transplanted seedlings thoroughly and monitor for signs of transplant shock, such as drooping or leaf discoloration. Consistent moisture helps the roots establish quickly.\",\n" +
  "        \"Apply a layer of mulch around the base of the plants to help retain soil moisture and suppress weeds.\"\n" +
  "      ],\n" +
  "      \"June\": [\n" +
  "        \"Continue providing consistent watering, especially during dry spells, to keep the soil evenly moist but not waterlogged.\",\n" +
  "        \"Inspect broccoli plants regularly for pests such as cabbage worms or aphids. Handpick pests or use organic insecticidal soap if necessary.\",\n" +
  "        \"Fertilize plants once in early June with a balanced fertilizer to support robust growth. This encourages large head development.\"\n" +
  "      ],\n" +
  "      \"July\": [\n" +
  "        \"Begin harvesting broccoli heads once they reach a suitable size, starting around July 10. Use a sharp knife to cut the heads off, leaving a few inches of stem to encourage side shoots.\",\n" +
  "        \"Continue harvesting broccoli heads until July 24. Regular harvesting encourages the plant to produce additional side shoots that can also be harvested.\",\n" +
  "        \"Post-harvest, remove broccoli plants from the garden by July 24 to prepare the soil for the next planting cycle of cauliflower. Clear away plant debris and consider adding compost to enrich the soil for the next crop.\"\n" +
  "      ],\n" +
  "      \"August\": [],\n" +
  "      \"September\": [],\n" +
  "      \"October\": [],\n" +
  "      \"November\": [],\n" +
  "      \"December\": []\n" +
  "    }\n" +
  "  },\n" +
  "  {\n" +
  "    \"plot\": 1,\n" +
  "    \"crop\": \"Cauliflower\",\n" +
  "    \"tasks\": {\n" +
  "      \"January\": [],\n" +
  "      \"February\": [],\n" +
  "      \"March\": [],\n" +
  "      \"April\": [],\n" +
  "      \"May\": [],\n" +
  "      \"June\": [],\n" +
  "      \"July\": [\n" +
  "        \"***indoors***Start cauliflower seeds indoors approximately 6-8 weeks before the outdoor transplant date (around July 3). Use seed-starting trays or pots filled with a high-quality seed starting mix that promotes healthy root growth. Sow seeds about 1/4 inch deep.\",\n" +
  "        \"***indoors***Maintain a consistent temperature of around 60°F-70°F for optimal germination. If your home is warmer, place the seed trays in a cooler area or use a fan to provide airflow and regulate temperature to prevent overheating.\",\n" +
  "        \"***indoors***Provide seedlings with 14-16 hours of light per day using grow lights, as natural light tends to be insufficient indoors. Grow lights support strong stem and leaf growth; without them, seedlings might become leggy (tall and weak) in their search for more light.\",\n" +
  "        \"***indoors***Use a small fan to ensure good air circulation around seedlings. This can help in strengthening the stems and preventing fungal diseases such as damping off—a condition causing seedlings to rot at the base, resulting in plant collapse.\"\n" +
  "      ],\n" +
  "      \"August\": [\n" +
  "        \"***indoors***Continue to water seedlings regularly but allow the top layer of soil to dry slightly between waterings to prevent overwatering. Look for signs of healthy growth: strong stems and vibrant green leaves.\",\n" +
  "        \"***indoors***Before transplanting outdoors, harden off your cauliflower seedlings for about a week. Gradually expose them to outdoor conditions, beginning with a few hours of indirect sunlight and increasing the duration each day. This process helps them adjust to outdoor temperatures and wind.\",\n" +
  "        \"Transplant cauliflower seedlings outdoors around August 27. Choose a cloudy day or transplant in the early evening to prevent heat stress. Space the seedlings 18-24 inches apart to allow adequate room for growth.\",\n" +
  "        \"After transplanting, water the seedlings thoroughly to help settle the soil around the roots and reduce transplant shock, which appears as droopy leaves and stunted growth.\"\n" +
  "      ],\n" +
  "      \"September\": [\n" +
  "        \"Apply a layer of mulch around the base of the small cauliflower plants to help retain moisture in the soil and control weeds, which can compete for nutrients and water.\",\n" +
  "        \"Monitor for pests such as cabbage loopers or aphids. These can be controlled with organic insecticides like neem oil or insecticidal soap. Regularly inspect leaves for holes or sticky residue.\",\n" +
  "        \"Maintain consistent watering, providing about 1-1.5 inches per week. This supports healthy growth and prevents issues like head splitting or poor development.\"\n" +
  "      ],\n" +
  "      \"October\": [\n" +
  "        \"Check cauliflowers regularly for signs of pests or diseases, removing any damaged leaves promptly to prevent spread.\",\n" +
  "        \"Continue regular watering and weed control to maintain healthy plants. Ensure the soil is well-draining to prevent root rot, which can cause plants to die from excess water around the roots.\",\n" +
  "        \"Apply a balanced fertilizer high in phosphorus and potassium to support the development of cauliflower heads.\"\n" +
  "      ],\n" +
  "      \"November\": [\n" +
  "        \"Watch for cauliflower heads to mature between November 15 and November 22. Harvest when heads are compact, white, and firm before they begin to separate.\",\n" +
  "        \"To harvest, cut the main stem with a sharp knife, leaving some leaves to protect the curd. If frost is expected, cover the plants to avoid damage.\",\n" +
  "        \"Post-harvest, remove plant debris from the garden to maintain cleanliness and prepare soil for future planting.\"\n" +
  "      ],\n" +
  "      \"December\": []\n" +
  "    }\n" +
  "  },\n" +
  "  {\n" +
  "...\n\n"

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
