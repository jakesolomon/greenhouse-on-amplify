import { defineFunction } from '@aws-amplify/backend';

export const promptLLM = defineFunction({
  entry: './handler.ts'
});