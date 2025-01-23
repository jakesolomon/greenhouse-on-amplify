import {Text, Card, Group, Grid, Skeleton, useMantineTheme, Anchor, Button, Stack, Image} from '@mantine/core';

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
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }} key={index}>
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            {
              crop
              ? <Stack>
                  {
                    crop.imageUrl &&
                    <Card.Section>
                      <Image
                        src={crop.imageUrl}
                        height={150}
                        alt={crop.name}
                      />
                    </Card.Section>
                  }
                  <Text fw={500}>{crop.name} {crop.variety && crop.variety}</Text>
                  <Text size="sm" c="dimmed">
                    {crop.shortDescription}
                  </Text>
                  {
                    crop.storeHandle &&
                    <Anchor href={"https://trueleafmarket.com/products/" + crop.storeHandle} target="_blank">
                      <Button variant="light" color={theme.colors.green[7]} >
                        Buy Seeds
                      </Button>
                    </Anchor>
                  }
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

