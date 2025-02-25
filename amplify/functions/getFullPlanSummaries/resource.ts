import { defineFunction, secret } from '@aws-amplify/backend';

export const getFullPlanSummaries = defineFunction({
  environment: {
    API_KEY: secret('OPENAI_API_KEY')
  },
  timeoutSeconds: 60
});