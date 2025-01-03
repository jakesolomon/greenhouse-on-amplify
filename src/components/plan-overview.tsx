import {Text, Container, Accordion, Skeleton, List, Title} from '@mantine/core';

import {
  ClimateDataOutput,
  CropDataOutput,
  PlantingScheduleOutput
} from '../types.ts'

import GanttChart from "./gantt-chart.tsx";
import ClimateChart from "./climate-chart.tsx";
import CropList from "./crop-list.tsx";

interface DataDisplayProps {
  cropData?: CropDataOutput;
  plantingSchedule?: PlantingScheduleOutput;
  climateData?: ClimateDataOutput;
}

const PlanOverview = (props: DataDisplayProps) => {
  const { cropData, plantingSchedule, climateData } = props;

  const skeletonParagraph =
    <>
      <Skeleton height={10} radius="xl" />
      <Skeleton height={10} mt={6} radius="xl" />
      <Skeleton height={10} mt={6} width="70%" radius="xl" />
    </>

  return (
    <Container px={0}>
      <Title mb="md">
        Plan Overview
      </Title>
      {
        cropData
          ? <Text size="md" mb="lg">{cropData.summary}</Text>
          : <>{skeletonParagraph}<br/></>
      }
      {
        plantingSchedule
          ? <Text size="md" mb="lg">{plantingSchedule.summary}</Text>
          : <>{skeletonParagraph}<br/></>
      }
      <GanttChart plantingSchedule={plantingSchedule} loading={!plantingSchedule}/>
      <Accordion mt="md">
        {
          climateData &&
          <Accordion.Item value="climateData">
            <Accordion.Control icon="☀️">Climate Predictions</Accordion.Control>
            <Accordion.Panel>
              <ClimateChart data={climateData}/>
            </Accordion.Panel>
          </Accordion.Item>
        }
        <Accordion.Item value="crops">
          <Accordion.Control icon="🥦">Crops</Accordion.Control>
          <Accordion.Panel>
            <CropList crops={cropData ? cropData.crops : undefined}/>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="additionalAdvice">
          <Accordion.Control icon="📝">Additional Advice</Accordion.Control>
          <Accordion.Panel>
            <List>
              {
                cropData
                ? cropData.additionalAdvice.map((advice, index) =>
                    <List.Item key={index}>{advice}</List.Item>)
                : <>
                    <Skeleton height={10} width="70%" mb={14} radius="xl"/>
                    <Skeleton height={10} width="80%" mb={14} radius="xl"/>
                    <Skeleton height={10} width="75%" mb={14} radius="xl"/>
                    <Skeleton height={10} width="70%" mb={14} radius="xl"/>
                    <Skeleton height={10} width="80%" mb={14} radius="xl"/>
                  </>
              }
            </List>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default PlanOverview;

