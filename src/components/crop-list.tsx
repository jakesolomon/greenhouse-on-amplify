import { Text, Card, Group, Stack, Grid, Badge, Skeleton, useMantineTheme } from '@mantine/core';

import { Crop } from '../types.ts'

interface CropListProps {
  crops?: Crop[];
}

const CropList = (props: CropListProps) => {
  const { crops } = props;

  const theme = useMantineTheme();

  return (
    <Grid>
      {(crops ? crops : Array(5).fill(null)).map((crop, index) => (
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={index}>
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            {
              crop
              ? <Stack>
                  <Text fw={500}>{crop.name} ({crop.variety})</Text>
                  <Text size="sm" c="dimmed">
                    Reason: {crop.shortDescription}
                  </Text>
                  <Group >
                    <Badge color={theme.colors.green[9]}>Seedling: {crop.seedlingDuration}</Badge>
                    <Badge color={theme.colors.green[9]}>Growth: {crop.growthDuration}</Badge>
                    <Badge color={theme.colors.green[9]}>Harvest: {crop.harvestDuration}</Badge>
                    <Badge color={theme.colors.green[9]}>Coldest Growth Temp: {crop.lowerTempBound}</Badge>
                    <Badge color={theme.colors.green[9]}>Hottest Growth Temprvest: {crop.upperTempBound}</Badge>
                  </Group>
                </Stack>
              : <>
                  <Skeleton height={10} mt={10} radius="xl" />
                  <Skeleton height={10} mt={10} radius="xl" />
                  <Skeleton height={10} mt={6} width="70%" radius="xl" />
                  <Group mt={18} >
                    <Skeleton height={18} width="7em" radius="xl" />
                    <Skeleton height={18} width="7em" radius="xl" />
                    <Skeleton height={18} width="7em" radius="xl" />
                    <Skeleton height={18} width="7em" radius="xl" />
                    <Skeleton height={18} width="7em" radius="xl" />
                  </Group>
                </>
            }
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default CropList;

