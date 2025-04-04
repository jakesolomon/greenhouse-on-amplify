import {CropDataForLLMRequests, AppendedPlanting, FullPlanTaskList} from './types'

export const introExtrasSystemPrompt =
  "You are a helpful gardening assistant, tasked with writing a clear and informative step-by-step garden plan for a beginner gardener. Using the provided information on the crop variety being used, and the climate in which the gardener will be growing, write guidance on how how the following two tasks come into play in the gardener's plan: pruning, support structures.\n" +
  "\n" +
  "***Guidelines***\n" +
  " - Aim for one paragraph of guidance per each section.\n" +
  " - Be specific as to how each task type affects the crops in the plan—how to execute, and what benefits the task will offer.\n" +
  " - If none of the crops provided require the use of one or both of the tasks, simply return an empty string for that task's output. (For example, if none of the crops require pruning, just return an empty string for the pruning output).\n" +
  "\n"

export const introExtrasUserPrompt = (crops: CropDataForLLMRequests[]) =>
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

export const tasksSystemPrompt =
  "You are a helpful gardening assistant, tasked with writing a clear and informative step-by-step garden plan for a beginner gardener. Using the provided information on the crop variety being used, and the climate in which the gardener will be growing, write a full todo list of activities to grow the crop from seed, all the way through the full duration of harvest. (Note that climate data are estimates, not perfectly reliable predictions.) Do not skip any step at all: for example, include detailed instructions for germination, growing seedlings, suggestions for grow lights or natural light, use of fans for strengthening seedlings, hardening off seedlings, transplanting into an outdoor garden, watching for common issues, etc.\n" +
  "\n" +
  "***Guidelines***\n" +
  "- Adhere to the timing milestones provided under \"Crop Information\". For activities that occur before transplanting, make sure they begin at the appropriate time leading up to transplanting date. For example, if a crop has a provided transplanting date of September 1st and takes one month to mature from germination, provide instructions to begin germinating seeds on August 1st.\n" +
  "- Mention any common issues that may occur when the timing is relevant. For any issue, give tips on what to watch for and what solutions may be used. For example, if an issue may present itself during the seedling state, list it as a task during the month when the plant is a seedling.\n" +
  "- In general, explain the reasoning behind tasks. But especially for optional suggestions, provide context as to why the suggestion is made and what the user can expect if they do not follow it (or do not have the means to follow it). For example, if suggesting to use grow lights to grow seedlings, explain how the grow lights benefit the plant, what problems may occur if the grow light is not used, and if there are other options a user may proceed with to remedy those issues if not using a grow light.\n" +
  "- Separate your tasks by month. Give some indication as to when the tasks should be carried out, but also indicate where there should be some flexibility in timing by indicating if tasks should be determined by other factors (e.g. wait for outdoor temps to reach xxx before transplanting seedlings).\n" +
  "- Tasks should be sorted into the month during which they should be executed. For example, the task 'Start cabbage seeds indoors around July 20, which is about 8 weeks before the outdoor transplanting date on September 17. ...' should be listed in July. This pattern ensures that the user will find information when they need to (reading each month's section during that part of their growing season), and avoid finding out that a task should have been carried out in the previous month(s)." +
  "- Do not include information about buying seeds or how to select an outdoor location to grow, as both of these aspects will be covered in a different section of the garden plan.\n" +
  "- Because the audience is a beginner gardener, feel free to use garden-specific terminology, but explain the meaning of terms that users may not be familiar with.\n" +
  "- The output parameter \"indoors\" is a boolean that represents whether or not that month's tasks take place before the crop has been transplanted outdoors. Mark as \"true\" if the tasks for that month pertain to growing seedlings indoors, mark as \"false\" in any other case.\n" +
  "- Append any tasks that take place before the crop has been transplanted outdoors with ***indoors*** at the beginning of the string to indicate that the plant is in seedling stage. For example: \"***indoors*** Start tomato seeds indoors approximately 6-8 weeks before the outdoor planting date ...\"\n" +
  "- The month outputs represent months of the year 2025. So for overwintering plantings (i.e. harvestStartDate and/or harvestEndDate in 2026), do not include any tasks that would take place after December 2025. For example, if garlic is to be planted in September and harvested the following May, provide instructions through December 2025, and do not provide any tasks for January—May. If this means that you don't provide tasks that range from start to harvest, simply summarize the remainder of the tasks in your latest included month.\n" +
  "\n" +
  "***Example Output***\n" +
  // "[\n" +
  "  {\n" +
  // "    \"plot\": 1,\n" +
  // "    \"crop\": \"Broccoli\",\n" +
  // "    \"tasks\": {\n" +
  "      \"January\": [],\n" +
  "      \"February\": [],\n" +
  "      \"March\": [\n" +
  "        \"***indoors*** Start broccoli seeds indoors approximately 6-8 weeks before the outdoor transplanting date, which is around May 1. Use seed-starting trays and a seed starting mix to provide optimal conditions for germination. Sow seeds about 1/4 inch deep.\",\n" +
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
  // "    }\n" +
  "  }\n"

  // "  },\n" +
  // "  {\n" +
  // "    \"plot\": 1,\n" +
  // "    \"crop\": \"Cauliflower\",\n" +
  // "    \"tasks\": {\n" +
  // "      \"January\": [],\n" +
  // "      \"February\": [],\n" +
  // "      \"March\": [],\n" +
  // "      \"April\": [],\n" +
  // "      \"May\": [\n" +
  // "        \"***indoors***Start cauliflower seeds indoors approximately 6-8 weeks before the outdoor transplant date (around July 24). Use seed-starting trays or pots filled with a high-quality seed starting mix that promotes healthy root growth. Sow seeds about 1/4 inch deep.\",\n" +
  // "        \"***indoors***Maintain a consistent temperature of around 60°F-70°F for optimal germination. If your home is warmer, place the seed trays in a cooler area or use a fan to provide airflow and regulate temperature to prevent overheating.\",\n" +
  // "        \"***indoors***Provide seedlings with 14-16 hours of light per day using grow lights, as natural light tends to be insufficient indoors. Grow lights support strong stem and leaf growth; without them, seedlings might become leggy (tall and weak) in their search for more light.\",\n" +
  // "        \"***indoors***Use a small fan to ensure good air circulation around seedlings. This can help in strengthening the stems and preventing fungal diseases such as damping off—a condition causing seedlings to rot at the base, resulting in plant collapse.\"\n" +
  // "      ],\n" +
  // "      \"June\": [\n" +
  // "        \"***indoors***Continue to water seedlings regularly but allow the top layer of soil to dry slightly between waterings to prevent overwatering. Look for signs of healthy growth: strong stems and vibrant green leaves.\",\n" +
  // "      ],\n" +
  // "      \"July\": [\n" +
  // "        \"***indoors***Before transplanting outdoors, harden off your cauliflower seedlings for about a week. Gradually expose them to outdoor conditions, beginning with a few hours of indirect sunlight and increasing the duration each day. This process helps them adjust to outdoor temperatures and wind.\",\n" +
  // "        \"Transplant cauliflower seedlings outdoors around July 24. Choose a cloudy day or transplant in the early evening to prevent heat stress. Space the seedlings 18-24 inches apart to allow adequate room for growth.\",\n" +
  // "        \"After transplanting, water the seedlings thoroughly to help settle the soil around the roots and reduce transplant shock, which appears as droopy leaves and stunted growth.\"\n" +
  // "      ],\n" +
  // "      \"September\": [\n" +
  // "        \"Apply a layer of mulch around the base of the small cauliflower plants to help retain moisture in the soil and control weeds, which can compete for nutrients and water.\",\n" +
  // "        \"Monitor for pests such as cabbage loopers or aphids. These can be controlled with organic insecticides like neem oil or insecticidal soap. Regularly inspect leaves for holes or sticky residue.\",\n" +
  // "        \"Maintain consistent watering, providing about 1-1.5 inches per week. This supports healthy growth and prevents issues like head splitting or poor development.\"\n" +
  // "      ],\n" +
  // "      \"October\": [\n" +
  // "        \"Check cauliflowers regularly for signs of pests or diseases, removing any damaged leaves promptly to prevent spread.\",\n" +
  // "        \"Continue regular watering and weed control to maintain healthy plants. Ensure the soil is well-draining to prevent root rot, which can cause plants to die from excess water around the roots.\",\n" +
  // "        \"Apply a balanced fertilizer high in phosphorus and potassium to support the development of cauliflower heads.\"\n" +
  // "      ],\n" +
  // "      \"November\": [\n" +
  // "        \"Watch for cauliflower heads to mature between November 15 and November 22. Harvest when heads are compact, white, and firm before they begin to separate.\",\n" +
  // "        \"To harvest, cut the main stem with a sharp knife, leaving some leaves to protect the curd. If frost is expected, cover the plants to avoid damage.\",\n" +
  // "        \"Post-harvest, remove plant debris from the garden to maintain cleanliness and prepare soil for future planting.\"\n" +
  // "      ],\n" +
  // "      \"December\": []\n" +
  // "    }\n" +
  // "  },\n" +
  // "  {\n" +
  // "...\n\n"

export const tasksUserPrompt = (planting: AppendedPlanting, climateData: string, nextPlanting?: AppendedPlanting) =>
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

const formatTasksForSummariesPrompt = (
  annotatedTasks: FullPlanTaskList[]
): string => {
  const formatted: Record<string, Record<string, Record<string, string[]>>> = {};

  for (const { plot, crop, tasks: taskByMonth } of annotatedTasks) {
    for (const [month, taskList] of Object.entries(taskByMonth) as [string, string[]][]) {
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

export const summariesSystemPrompt =
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

export const summariesUserPrompt = (
  tasksData: FullPlanTaskList[],
  companionPlantingAdvice: string,
  climateInformation: string
) =>
  "***Task Schedule***\n" +
  "```\n" +
  formatTasksForSummariesPrompt(tasksData) +
  "`\n```\n\n" +
  "***Companion Planting Advice***\n" +
  "```\n" +
  {companionPlantingAdvice} +
  "\n```\n\n" +
  "***Climate Information***\n" +
  "```\n" +
  {climateInformation} +
  "\n```"
