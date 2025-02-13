import { defineFunction } from '@aws-amplify/backend';

export const handleStripePurchase = defineFunction({
  timeoutSeconds: 60
});