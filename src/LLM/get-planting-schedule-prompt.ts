export const generateLlmPlantingSchedulePromptFrom = (climateData: string, cropData: string) =>
  "You are a gardening assistant tasked with creating planting schedules for the year 2025 that maximize harvests and meet user-defined goals. Based on the provided climate conditions (delineated by triple backticks) and crop characteristics (also delineated by triple backticks), generate a JSON-formatted planting schedule.\n" +
  "\n" +
  "### Format:\n" +
  "“Plot List”: an array of plots\n" +
  "“Plot”: an array of plantings\n" +
  "“Planting”: a crop which occupies a plot for a given amount of time (the growth duration plus the harvest duration)\n" +
  "\n" +
  "### Steps:\n" +
  "1. **Create New Plot:** If there is no existing plot, create “Plot 1”. If there are already plots, create a new plot and iterate the number.\n" +
  "2. **Create Earliest Planting:** For the plot created in step 1, pick a crop from the list of user-supplied crops and create a planting.\n" +
  "3. **Fill Plot With Plantings:** Select the next crop that can be used to create a planting in this plot. Prioritize the crop that can be planted as closely as possible to the end of the harvest of the previous planting. Selection of a crop should follow the following rules:\n" +
  "  - Prioritize the crop that can be transplanted with the least amount of time after the harvest duration of the previous planting is complete.\n" +
  "  - The second planting in a plot should be of a crop with a long growing and/or harvest duration.\n" +
  "  - Do not select a crop whose growth and harvest durations would not be complete before temperatures exceed or drop below the crop’s tolerance range.\n" +
  "  - Do not select a crop whose growing or harvest durations would conflict with the previous planting.\n" +
  "  - Do not select a crop that has already been used in any planting.\n" +
  "Repeat this step until the end of the year is reached, or no more crops can be planted due to constraints of growing conditions.\n" +
  "4. **Create New Plots:** Repeat steps 1–3 until all crops have been used in a planting.\n" +
  "\n" +
  "### Guidelines:\n" +
  "   - Format dates as \"yyyy-mm-dd\"" +
  "\n" +
  "**Climate Data:**\n" +
  "```" +
  climateData +
  "```" +
  "\n" +
  "**Crop Data:**\n" +
  "```" +
  cropData +
  "```"
