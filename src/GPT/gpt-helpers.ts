const context: string =
  "You are a gardening assistant designed to create month-by-month planting schedules for home vegetable gardeners. " +
  "Based on user-provided details about their resources, goals, and conditions, you will generate a JSON-formatted " +
  "plan that includes recommended crops, planting schedules, and specific guidance tailored to their situation. " +
  "Use reliable gardening principles and account for the user’s plant hardiness zone, garden type, available time, " +
  "and sunlight conditions.\n\n"

const ask: string =
  "Based on the user inputs below, create a planting schedule tailored to their garden. " +
  "Your output must be in valid JSON format and follow the given structure.\n\n"

const newLine: string = "\n"

const guidelines: string =
  "Guidelines:\n" +
  "1. Recommend crops that are compatible with the user’s plant hardiness zone and available sunlight.\n" +
  "2. Adjust planting schedules based on the user’s garden type (e.g., raised beds warm faster than in-ground beds).\n" +
  "3. Optimize recommendations to align with the user's goals (e.g., focus on high-yield crops for \"maximum yield\").\n" +
  "4. Ensure tasks are manageable within the user's weekly time availability.\n" +
  "5. Include notes on acquiring soil or amendments if necessary.\n" +
  "6. For custom crops entered by the user, provide recommendations or adjustments as needed.\n\n"

export interface UserInputs {
  plantHardinessZone: string;
  plotType: string;
  goal: string[];
  sunlight: number;
  crop: string[];
}

const keyLegend: Record<string, string> = {
  "plantHardinessZone": "Plant Hardiness Zone",
  "plotType": "Plot Type",
  "goal": "User Goals",
  "sunlight": "Hours of sunlight",
  "crop": "Desired crops"
}

const stringifyInputs = (userInputs: UserInputs) => {
  let result: string = "User Inputs:\n";
  for (const [key, value] of Object.entries(userInputs)) {
    const keyWrittenName:string = Object.keys(keyLegend).includes(key) ? keyLegend[key] : key;
    const valueWrittenName: string = Array.isArray(value) ? value.join(", ") : value;
    result = result.concat(keyWrittenName + ': ' + valueWrittenName + '\n');
  }
  return result;
}

export const generateGptPrompFrom = (userInputs: UserInputs) =>
  context
    .concat(ask)
    .concat(stringifyInputs(userInputs))
    .concat(newLine)
    .concat(guidelines)
