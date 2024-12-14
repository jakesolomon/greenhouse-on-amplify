import { Text, Card, Group, Badge, Stack, Container, Grid} from '@mantine/core';
import { PlantingDateSchema, GardenPlan } from '../types.ts'
import GanttChart from "./gantt-chart.tsx";

interface DataDisplayProps {
  data: GardenPlan;
}

const PlanOverview = (props: DataDisplayProps) => {
  const { data } = props;
  const { summary, crops, additionalAdvice } = data;

  const formatDate = (date: PlantingDateSchema) => `${date.month}/${date.day}`;

  return (
    <Container>
      <Text size="xl" mb="lg">
        Gardening Plan Overview
      </Text>
      <Text size="md" mb="lg">
        {summary}
      </Text>
      <GanttChart crops={crops} />
      <Grid>
        {crops.map((crop, index) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
              <Stack>
                <Text fw={500}>{crop.name} ({crop.variety})</Text>
                <Text size="sm" c="dimmed">
                  Reason: {crop.reason}
                </Text>
                <Group >
                  <Badge color="dark" >Plant: {formatDate(crop.plantingDate)}</Badge>
                  <Badge color="teal">Harvest: {formatDate(crop.harvestDate)}</Badge>
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

