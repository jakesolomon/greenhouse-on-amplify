import {Text, Card, Group, Grid, Skeleton, useMantineTheme, Anchor, Button, Stack, Image} from '@mantine/core';

import { Crop } from '../types.ts'

interface CropListProps {
  crops?: Crop[];
}

const CropList = (props: CropListProps) => {
  const { crops } = props;

  const theme = useMantineTheme();

  const generateAffiliateLink = (storeHandle: string) => {
    // example input: beet-detroit-dark-red-vegetable-seeds
    // example output: https://www.pjtra.com/t/8-11415-363806-153185?url=https%3A%2F%2Ftrueleafmarket.com%2Fproducts%2Fbeet-detroit-dark-red-vegetable-seeds
    // links to: https://trueleafmarket.com/products/beet-detroit-dark-red-vegetable-seeds

    const productsUrl = "https://trueleafmarket.com/products/"
    const baseAffiliateUrl = "https://www.pjtra.com/t/8-11415-363806-153185?url=";
    const encodedUrl = encodeURIComponent(productsUrl + storeHandle);
    return `${baseAffiliateUrl}${encodedUrl}`;
  }

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
                  <Text fw={500}>{crop.name} - {crop.variety ? crop.variety : "(no variety found)"}</Text>
                  <Text size="sm" c="dimmed">
                    {crop.shortDescription}
                  </Text>
                  {
                    crop.storeHandle &&
                    <Anchor href={generateAffiliateLink(crop.storeHandle)} target="_blank">
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

