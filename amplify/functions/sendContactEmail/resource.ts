import { defineFunction } from '@aws-amplify/backend';

export const sendContactEmail = defineFunction({
  timeoutSeconds: 30
});