import { Timeline, Text, Card, Group, Badge, Stack, Container } from '@mantine/core';
import { PlantingDateSchema, GardenPlan } from '../types.ts'

interface DataDisplayProps {
  data: GardenPlan;
}

const PlanOverview = (props: DataDisplayProps) => {
  const { data } = props;
  const { crops, additionalAdvice } = data;

  const formatDate = (date: PlantingDateSchema) => `${date.month}/${date.day}`;

  return (
    <Container>
      <Text size="xl" mb="lg">
        Gardening Plan Timeline
      </Text>

      <Timeline active={crops.length} bulletSize={24} lineWidth={2}>
        {crops.map((crop, index) => (
          <Timeline.Item
            key={index}
            bullet={<Badge>{crop.name}</Badge>}
            title={`${crop.name} (${crop.variety})`}
          >
            <Card shadow="sm" padding="md" radius="md" withBorder>
              <Stack>
                <Text size="sm">
                  Reason: {crop.reason}
                </Text>
                <Group >
                  <Badge color="green">Plant: {formatDate(crop.plantingDate)}</Badge>
                  <Badge color="yellow">Harvest: {formatDate(crop.harvestDate)}</Badge>
                </Group>
              </Stack>
            </Card>
          </Timeline.Item>
        ))}
      </Timeline>

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

