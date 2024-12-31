import { Text, Card, Group, Stack, Grid, Badge } from '@mantine/core';

import { Crop } from '../types.ts'

interface CropListProps {
  crops: Crop[];
}

const CropList = (props: CropListProps) => {
  const { crops } = props;

  return (
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
  );
};

export default CropList;

