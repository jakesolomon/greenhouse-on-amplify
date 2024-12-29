import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { getCropData } from './functions/getCropData/resource';
import { getClimateData } from './functions/getClimateData/resource';
import { getPlantingScheduleData } from './functions/getPlantingScheduleData/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  auth,
  data,
  getCropData,
  getClimateData,
  getPlantingScheduleData
});
