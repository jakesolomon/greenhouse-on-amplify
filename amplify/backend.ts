import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { getCropData } from './functions/getCropData/resource';
import { getCompanionPlants } from './functions/getCompanionPlants/resource';
import { getTrueLeafSeedData } from './functions/getTrueLeafSeedData/resource';
import { getCropDataFromTrueLeafDescription } from './functions/getCropDataFromTrueLeafDescription/resource';
import { getClimateData } from './functions/getClimateData/resource';
import { getFullPlanContent } from './functions/getFullPlanContent/resource';
import { getFullPlanIntroExtras } from './functions/getFullPlanIntroExtras/resource';
import { getFullPlanTasks } from './functions/getFullPlanTasks/resource';
import { getFullPlanSummaries } from './functions/getFullPlanSummaries/resource';
import { getScheduleSummary } from './functions/getScheduleSummary/resource';
import { getPlantingScheduleData } from './functions/getPlantingScheduleData/resource';
import { createCheckoutSession } from './functions/createCheckoutSession/resource';
import { handleStripePurchase } from './functions/handleStripePurchase/resource';
import { sendContactEmail } from './functions/sendContactEmail/resource';
import { sendPrivySignup } from './functions/sendPrivySignup/resource';
import {fulfillV2Guide} from "./functions/fulfillV2Guide/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  auth,
  data,
  getCropData,
  getCompanionPlants,
  getTrueLeafSeedData,
  getCropDataFromTrueLeafDescription,
  getClimateData,
  getFullPlanContent,
  getFullPlanIntroExtras,
  getFullPlanTasks,
  getFullPlanSummaries,
  getScheduleSummary,
  getPlantingScheduleData,
  createCheckoutSession,
  fulfillV2Guide,
  handleStripePurchase,
  sendContactEmail,
  sendPrivySignup
});
