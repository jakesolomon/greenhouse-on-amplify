import { Text, Container, Accordion } from '@mantine/core';

import {
  ClimateDataOutput,
  CropDataOutput,
  PlantingScheduleOutput
} from '../types.ts'

import GanttChart from "./gantt-chart.tsx";
import ClimateChart from "./climate-chart.tsx";
import CropList from "./crop-list.tsx";

interface DataDisplayProps {
  cropData: CropDataOutput;
  plantingSchedule?: PlantingScheduleOutput;
  loadingPlantingSchedule: boolean;
  climateData?: ClimateDataOutput;
}

const PlanOverview = (props: DataDisplayProps) => {
  const { cropData, plantingSchedule, loadingPlantingSchedule, climateData } = props;
  const { summary, crops, additionalAdvice } = cropData;

  return (
    <Container px={0}>
      <Text size="xl" mb="lg">
        Plan Overview
      </Text>
      <Text size="md" mb="lg">
        {summary && <>{summary}<br/><br/></>}
        {plantingSchedule?.summary}
        </Text>
        {
          loadingPlantingSchedule || !plantingSchedule
        ? "thinking about things, plelase wait"
        : <GanttChart plantingSchedule={plantingSchedule} />
      }
      {/*<Card withBorder mt="md" padding="sm" radius="md">*/}
        <Accordion mt="md">
          {
            climateData &&
            <Accordion.Item value="climateData">
              <Accordion.Control icon="☀️">Climate Predictions</Accordion.Control>
              <Accordion.Panel>
                <ClimateChart data={climateData} />
              </Accordion.Panel>
            </Accordion.Item>
          }
          <Accordion.Item value="crops">
            <Accordion.Control icon="🥦">Crops</Accordion.Control>
            <Accordion.Panel>
              <CropList crops={crops}/>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="additionalAdvice">
            <Accordion.Control icon="📝">Additional Advice</Accordion.Control>
            <Accordion.Panel>
              <ul>
                {additionalAdvice.map((advice, index) => (
                  <li key={index}>{advice}</li>
                ))}
              </ul>
              {/*<Stack>*/}
              {/*  {additionalAdvice.map((advice, index) => (*/}
              {/*    <Card key={index} shadow="xs" padding="sm" radius="md" withBorder>*/}
              {/*      <Text>{advice}</Text>*/}
              {/*    </Card>*/}
              {/*  ))}*/}
              {/*</Stack>*/}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      {/*</Card>*/}
    </Container>
  );
};

export default PlanOverview;

