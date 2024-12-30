import { defineFunction, secret } from '@aws-amplify/backend';

export const getPlantingScheduleData = defineFunction({
  environment: {
    API_KEY: secret('OPENAI_API_KEY')
  },
  timeoutSeconds: 60
});