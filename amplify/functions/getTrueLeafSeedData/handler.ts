import fetch from 'node-fetch'; // For Node.js < 18. Use global fetch for Node.js 18+.
import { Schema } from "../../data/resource";
import {SearchParameter, SelectableCropType} from "../../../src/helpers/true-leaf-crop-types";

export const handler: Schema["getTrueLeafSeedData"]["functionHandler"]  = async (event) => {

  const { cropTypes } = event.arguments;

  if (!cropTypes) {
    return JSON.stringify({ error: "No crop types provided" })
  }

  const parsedCropTypes = JSON.parse(cropTypes);
  const url = "https://trueleafmarket.com/api/collectionSearch?_data=routes%2F%28%24locale%29.api.collectionSearch";

  // Create an array of promises for each crop type
  const fetchPromises = parsedCropTypes.map(async (cropType: SelectableCropType) => {
    const searchParametersArray: SearchParameter[] = []
    const inStockParameter = {"name":"In stock","tags":["In Stock"],"category":"Availability"}
    const vegetableUseParameter = {"name":"Vegetable","tags":["Vegetable"],"category":"Intended Use "}
    searchParametersArray.push(inStockParameter)
    searchParametersArray.push(vegetableUseParameter)
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

      // Causes linting warning: 'throw' of exception caught locally
      // TODO: This is probably not the right way to do this
      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${cropType}: ${response.statusText}`);
      }

      const data = await response.json();
      return { cropType, data }; // Return crop type and data for tracking
    } catch (error) {
      console.error(`Error fetching data for ${cropType.displayName}:`, error);
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
