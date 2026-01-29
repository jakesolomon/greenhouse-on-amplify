import fetch from 'node-fetch'; // For Node.js < 18. Use global fetch for Node.js 18+.
import { Logger } from "@aws-lambda-powertools/logger";
import * as Sentry from "@sentry/aws-serverless";

import { Schema } from "../../data/resource";

const logger = new Logger({ serviceName: "getPlantingScheduleData" });

interface SelectableCropSubType {
  displayName: string;
  collectionHandle: string
  subTypeParameters?: SearchParameter[]
}

interface SearchParameter {
  name: string
  tags: string[]
  category: string
}

Sentry.init({
  dsn: "https://f07cd6da9a3fe49e5326614e1e037798@o470321.ingest.us.sentry.io/4510620412215296",
});

export const handler: Schema["getTrueLeafSeedData"]["functionHandler"]  = async (event) => {

  const { cropTypes, mode } = event.arguments;

  if (!cropTypes) {
    Sentry.captureMessage("Error in getTrueLeafSeedData function. No crop types provided.", "error");
    return JSON.stringify({ error: "No crop types provided" })
  }

  const parsedCropTypes = JSON.parse(cropTypes!);
  const url = "https://trueleafmarket.com/api/collectionSearch?_data=routes%2F%28%24locale%29.api.collectionSearch";

  // Create an array of promises for each crop type
  const fetchPromises = parsedCropTypes.map(async (cropType: SelectableCropSubType) => {
    const searchParametersArray: SearchParameter[] = []
    const inStockParameter = {"name":"In stock","tags":["In Stock"],"category":"Availability"}
    const vegetableUseParameter = {"name":"Vegetable","tags":["Vegetable"],"category":"Intended Use "}
    searchParametersArray.push(inStockParameter)
    if (mode === 'crop') {
      searchParametersArray.push(vegetableUseParameter)
    }
    const cropSpecificSearchParametersArray =
      searchParametersArray.concat(cropType.subTypeParameters ? cropType.subTypeParameters : [])
    const searchParameters = JSON.stringify(cropSpecificSearchParametersArray)

    const formData = new URLSearchParams();
    formData.append("collectionHandle", cropType.collectionHandle);
    formData.append("page", "1");
    formData.append("sortBy", "normal");
    formData.append("searchFilters", searchParameters || "[]");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      const data = await response.json();
      return { cropType, data }; // Return crop type and data for tracking
    } catch (error) {
      Sentry.captureMessage(`Error in getTrueLeafSeedData function. Error fetching data for crop ${cropType.displayName}.`, "error");
      logger.error(`Error fetching data for ${cropType.displayName}.`, error as Error);
      return { cropType, error: error }; // Return error info for tracking
    }
  });

  const results = await Promise.all(fetchPromises);

  // Handle results (successes and errors)
  const successfulResults = results.filter(result => !result.error);
  const failedResults = results.filter(result => result.error);

  console.log("Successful results:", successfulResults);
  console.log("Failed results:", failedResults);

  return JSON.stringify(successfulResults)
};
