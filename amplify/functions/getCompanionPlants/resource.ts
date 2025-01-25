import { defineFunction, secret } from '@aws-amplify/backend';

export const getCompanionPlants = defineFunction({
  environment: {
    API_KEY: secret('OPENAI_API_KEY')
  },
  timeoutSeconds: 45
});