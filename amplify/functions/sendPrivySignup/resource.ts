import { defineFunction } from '@aws-amplify/backend';

export const sendPrivySignup = defineFunction({
  timeoutSeconds: 30
});