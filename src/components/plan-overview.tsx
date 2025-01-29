import {
  Text,
  Container,
  Accordion,
  Skeleton,
  Title,
  List,
  AppShell,
  Center,
  Image,
  useMantineTheme,
  Anchor
} from '@mantine/core';
import {useViewportSize} from "@mantine/hooks";

import {
  ClimateDataOutput,
  Crop,
  Planting
} from '../types.ts'

import GanttChart from "./gantt-chart.tsx";
import ClimateChart from "./climate-chart.tsx";
import CropList from "./crop-list.tsx";
import {useEffect, useState} from "react";
import Logo from "../assets/full-logo-text-color.svg";

interface DataDisplayProps {
  crops?: Crop[];
  plantingSchedule: Planting[][];
  climateData?: ClimateDataOutput;
  summary?: string;
  companionPlantingAdvice?: string[],
  companionPlants?: {displayName: string, storeHandle: string}[]
  startPlanOver: () => void
}

const PlanOverview = (props: DataDisplayProps) => {
  const { crops, plantingSchedule, climateData, summary, companionPlantingAdvice, companionPlants, startPlanOver } = props;

  const plantingScheduleLoading = plantingSchedule.length === 0;

  const [ fakeLoading, setIsFakeLoading ] = useState<boolean>(true);
  const [ showLoadingTimeWarning, setShowLoadingTimeWarning ] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsFakeLoading(false)
    }, 1700);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowLoadingTimeWarning(true)
    }, 5500);
  }, []);

  const { width } = useViewportSize();
  const trueWidth = width < 960 + 32 * 2 ? width - 32 * 2 : 960
  const theme = useMantineTheme();
  const isSmallScreen = trueWidth.toString() < theme.breakpoints.md

  // Extract growing tips. Remove any sentence that refers to crop rotation.
  const growingTips = crops?.map(crop => ({
    name: crop.name,
    content: crop.guidance.split(".").filter(sentence => !sentence.includes("rotat")).map(sentence => sentence + ".").slice(0, -1).join(" "),
  }))

  const skeletonParagraph =
    <>
      <Skeleton height={10} radius="xl" mb="sm" />
      <Skeleton height={10} mt={6} radius="xl" mb="sm" />
      <Skeleton height={10} mt={6} radius="xl" mb="sm" />
      <Skeleton height={10} mt={6} radius="xl" mb="sm" />
      {
        isSmallScreen &&
        <>
          <Skeleton height={10} mt={6} radius="xl" mb="sm" />
          <Skeleton height={10} mt={6} radius="xl" mb="sm" />
          <Skeleton height={10} mt={6} radius="xl" mb="sm" />
          <Skeleton height={10} mt={6} radius="xl" mb="sm" />
          <Skeleton height={10} mt={6} radius="xl" mb="sm" />
        </>
      }
      <Skeleton height={10} mt={6} width="70%" radius="xl" mb="sm" />
    </>

  const replaceCompanionPlantsWithLinks = (advice: string, plantsWithLinks: {displayName: string, storeHandle: string}[]) => {
    // Create a map for faster lookup of storeHandles by plant name
    const plantMap: Record<string, string> = plantsWithLinks.reduce((map, plant) => {
      map[plant.displayName.toLowerCase()] = plant.storeHandle;
      return map;
    }, {} as Record<string, string>);

    // Generate a regex to match all plant names
    const plantNames = plantsWithLinks.map(plant => plant.displayName);
    const regex = new RegExp(`\\b(${plantNames.map(name => `${name}s?`).join('|')})\\b`, 'i');

    // Track which plants have already been linked
    const linkedPlants = new Set<string>();

    // Replace plant names with React links
    return advice.split(regex).map((chunk, index) => {
      const normalizedChunk = chunk.toLowerCase();
      // Check for uppercase, lowercase, and remove last letter from each (in case plural).
      if ((plantMap[chunk] || plantMap[normalizedChunk]) && !linkedPlants.has(normalizedChunk)) {
        linkedPlants.add(normalizedChunk); // Mark this plant as linked
        return (
          <a key={index} href={`https://trueleafmarket.com/products/${plantMap[normalizedChunk]}`} target="_blank" rel="noopener noreferrer">
            {chunk}
          </a>
        );
      }
      if ((plantMap[chunk.slice(0, chunk.length -1)] || plantMap[normalizedChunk.slice(0, normalizedChunk.length -1)]) && !linkedPlants.has(normalizedChunk)) {
        linkedPlants.add(normalizedChunk); // Mark this plant as linked
        return (
          <a key={index} href={`https://trueleafmarket.com/products/${plantMap[normalizedChunk.slice(0, normalizedChunk.length -1)]}`} target="_blank" rel="noopener noreferrer">
            {chunk}
          </a>
        );
      }
      return chunk;
    });
  }

  return (
    <Container px={0}>
      <Title mb="md">
        Plan Overview
      </Title>
      <Text size="md" mb={summary && !fakeLoading ? "sm" : "lg"}>
        {/*Your 2025 planting schedule is designed to optimize your garden's productivity by strategically timing the planting and harvesting of each crop. The diagram is color-coded to match specific areas in your garden, helping you keep track of where each crop belongs throughout the season. You’ll notice that some crops may be scheduled to follow others in the same areas—this is called <i>succession planting</i>, and it helps you maximize your space by rotating crops throughout the season.*/}
        Your 2025 planting schedule optimizes the productivity of your garden by timing when to plant and harvest each crop. The color-coded diagram shows where each crop belongs, and some crops are scheduled to follow others in the same areas—a method called <i>succession planting</i> that maximizes space by staggering planting times.
      </Text>
      {
        summary && !fakeLoading
          ? <Text size="md" mb="lg">{summary}</Text>
          : <>{skeletonParagraph}<br/></>
      }
      <GanttChart
        plantingSchedule={plantingScheduleLoading ? undefined : plantingSchedule}
        loading={plantingScheduleLoading || fakeLoading}
        showLoadingTimeWarning={showLoadingTimeWarning}
      />
      <Accordion mt="md" transitionDuration={350}>
        <Accordion.Item value="crops">
          <Accordion.Control icon="🥦">Crops</Accordion.Control>
          <Accordion.Panel>
            <CropList crops={crops}/>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="additionalAdvice">
          <Accordion.Control icon="📝">Growing Tips</Accordion.Control>
          <Accordion.Panel>
            <List>
              {
                growingTips && !fakeLoading
                ? growingTips.map((advice, index) =>
                    <List.Item key={index}><b>{advice.name}:</b> {advice.content}</List.Item>)
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
        <Accordion.Item value="companionPlants">
          <Accordion.Control icon="🤝">Companion Plants</Accordion.Control>
          <Accordion.Panel>
            <List>
              <Text size="sm" c="dimmed" mb="sm">Companion planting involves pairing plants that benefit each other. By planting certain crops together, companion planting boosts your garden's health and productivity. It’s a natural way to improve growth and protect against pests.</Text>
              {
                companionPlantingAdvice && companionPlants && !fakeLoading
                  ? companionPlantingAdvice.map((advice, index) =>
                    <List.Item key={index}><b>{advice.split("***")[0]}</b> {replaceCompanionPlantsWithLinks(advice.split("***")[1], companionPlants)}</List.Item>)
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
        {
          climateData &&
          <Accordion.Item value="climateData">
            <Accordion.Control icon="☀️">Climate Predictions</Accordion.Control>
            <Accordion.Panel>
              <ClimateChart data={climateData}/>
            </Accordion.Panel>
          </Accordion.Item>
        }
      </Accordion>
      <Container my="md" display="flex">
        <Text size="sm" c="dimmed">Want to create a different plan? {isSmallScreen && <br/>}<Anchor onClick={startPlanOver}>Start over here.</Anchor></Text>
      </Container>
      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Center py="md">
          <Image src={Logo} className="footer-logo" alt="logo" />
        </Center>
      </AppShell.Footer>
    </Container>
  );
};

export default PlanOverview;

