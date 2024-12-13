import { defineFunction, secret } from '@aws-amplify/backend';

export const promptLLM = defineFunction({
  environment: {
    API_KEY: secret('OPENAI_API_KEY')
  },
  timeoutSeconds: 20
});