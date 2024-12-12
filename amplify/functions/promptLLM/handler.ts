import type { Handler } from 'aws-lambda';
import { Schema } from "../../data/resource";

export const handler: Schema["promptLLM"]["functionHandler"]  = async (event) => {
  // your function code goes here
  const { prompt } = event.arguments

  return 'Hello, idiot!';
};