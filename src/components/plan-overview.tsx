import { Text, Card, Group, Badge, Stack, Container, Grid} from '@mantine/core';

import {
  ClimateDataOutput,
  CropDataOutput,
  PlantingScheduleOutput
} from '../types.ts'

import GanttChart from "./gantt-chart.tsx";
import ClimateChart from "./climate-chart.tsx";

interface DataDisplayProps {
  cropData: CropDataOutput;
  plantingSchedule?: PlantingScheduleOutput;
  loadingPlantingSchedule: boolean;
  climateData?: ClimateDataOutput;
}

const PlanOverview = (props: DataDisplayProps) => {
  const { cropData, plantingSchedule, loadingPlantingSchedule, climateData } = props;
  const { summary, crops, additionalAdvice } = cropData;

  console.log(climateData)
  console.log(!!climateData)

  return (
    <Container>
      <Text size="xl" mb="lg">
        Gardening Plan Overview
      </Text>
      <Text size="md" mb="lg">
        {summary}
        <br/><br/>
        {plantingSchedule?.summary}
      </Text>
      {
        loadingPlantingSchedule || !plantingSchedule
        ? "thinking about things, plelase wait"
        : <GanttChart plantingSchedule={plantingSchedule} />
      }
      {
        climateData &&
        <ClimateChart data={climateData} />
      }
      <Grid>
        {crops.map((crop, index) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={index}>
            <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
              <Stack>
                <Text fw={500}>{crop.name} ({crop.variety})</Text>
                <Text size="sm" c="dimmed">
                  Reason: {crop.reason}
                </Text>
                <Group >
                  <Badge>Seedling: {crop.seedlingDuration}</Badge>
                  <Badge>Growth: {crop.growthDuration}</Badge>
                  <Badge>Harvest: {crop.harvestDuration}</Badge>
                  <Badge>Coldest Growth Temp: {crop.lowerTempBound}</Badge>
                  <Badge>Hottest Growth Temprvest: {crop.upperTempBound}</Badge>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
      <Text size="lg" mt="xl" mb="sm">
        Additional Advice
      </Text>
      <Stack>
        {additionalAdvice.map((advice, index) => (
          <Card key={index} shadow="xs" padding="sm" radius="md" withBorder>
            <Text>{advice}</Text>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default PlanOverview;

