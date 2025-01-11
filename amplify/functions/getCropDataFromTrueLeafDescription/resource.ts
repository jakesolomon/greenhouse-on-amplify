import { defineFunction, secret } from '@aws-amplify/backend';

export const getCropDataFromTrueLeafDescription = defineFunction({
  environment: {
    API_KEY: secret('OPENAI_API_KEY')
  },
  timeoutSeconds: 30
});