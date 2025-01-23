import {Text, Container, Accordion, Skeleton, Title, List} from '@mantine/core';

import {
  ClimateDataOutput,
  Crop,
  Planting
} from '../types.ts'

import GanttChart from "./gantt-chart.tsx";
import ClimateChart from "./climate-chart.tsx";
import CropList from "./crop-list.tsx";
import {useEffect, useState} from "react";

interface DataDisplayProps {
  crops?: Crop[];
  plantingSchedule: Planting[][];
  climateData?: ClimateDataOutput;
  summary?: string;
}

const PlanOverview = (props: DataDisplayProps) => {
  const { crops, plantingSchedule, climateData, summary } = props;

  const plantingScheduleLoading = plantingSchedule.length === 0;

  const [ fakeLoading, setIsFakeLoading ] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setIsFakeLoading(false)
    }, 1700);
  }, []);

  // Extract growing tips. Remove any sentence that refers to crop rotation.
  const growingTips = crops?.map(crop => ({
    name: crop.name,
    content: crop.guidance.split(".").filter(sentence => !sentence.includes("rotat")).map(sentence => sentence + ".").slice(0, -1),
  }))

  const skeletonParagraph =
    <>
      <Skeleton height={10} radius="xl" />
      <Skeleton height={10} mt={6} radius="xl" />
      <Skeleton height={10} mt={6} radius="xl" />
      <Skeleton height={10} mt={6} width="70%" radius="xl" />
    </>

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
      />
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
      </Accordion>
    </Container>
  );
};

export default PlanOverview;

