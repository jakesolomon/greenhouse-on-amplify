import {defineFunction, secret} from '@aws-amplify/backend';

export const handleStripePurchase = defineFunction({
  environment: {
    STRIPE_API_KEY: secret('STRIPE_API_KEY'),
    OPENAI_API_KEY: secret('OPENAI_API_KEY')
  },
  timeoutSeconds: 600
});