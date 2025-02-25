import { defineFunction, secret } from '@aws-amplify/backend';

export const getFullPlanContent = defineFunction({
  environment: {
    API_KEY: secret('OPENAI_API_KEY')
  },
  timeoutSeconds: 300
});