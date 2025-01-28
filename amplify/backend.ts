import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { getCropData } from './functions/getCropData/resource';
import { getCompanionPlants } from './functions/getCompanionPlants/resource';
import { getTrueLeafSeedData } from './functions/getTrueLeafSeedData/resource';
import { getCropDataFromTrueLeafDescription } from './functions/getCropDataFromTrueLeafDescription/resource';
import { getClimateData } from './functions/getClimateData/resource';
import { getScheduleSummary } from './functions/getScheduleSummary/resource';
import { getPlantingScheduleData } from './functions/getPlantingScheduleData/resource';

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
  getScheduleSummary,
  getPlantingScheduleData
});
