import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { getCompanionPlants } from './functions/getCompanionPlants/resource';
import { getTrueLeafSeedData } from './functions/getTrueLeafSeedData/resource';
import { getCropDataFromTrueLeafDescription } from './functions/getCropDataFromTrueLeafDescription/resource';
import { getClimateData } from './functions/getClimateData/resource';
import { getScheduleSummary } from './functions/getScheduleSummary/resource';
import { createCheckoutSession } from './functions/createCheckoutSession/resource';
import { handleStripePurchase } from './functions/handleStripePurchase/resource';
import { sendContactEmail } from './functions/sendContactEmail/resource';
import { sendPrivySignup } from './functions/sendPrivySignup/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  auth,
  data,
  getCompanionPlants,
  getTrueLeafSeedData,
  getCropDataFromTrueLeafDescription,
  getClimateData,
  getScheduleSummary,
  createCheckoutSession,
  handleStripePurchase,
  sendContactEmail,
  sendPrivySignup
});
