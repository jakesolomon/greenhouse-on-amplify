import { Gantt, Task, ViewMode } from 'gantt-task-react';
import { useEffect, useState } from "react";
import {Container, useMantineTheme, Badge, Flex, Text, Card} from "@mantine/core";
import "gantt-task-react/dist/index.css";

import { Planting, PlantingScheduleOutput} from '../types.ts'

import useWindowSize from '../helpers/useWindowSize.ts';

import "./gantt-chart.css";

interface GanttChartProps {
  plantingSchedule: PlantingScheduleOutput;
}

const GanttChart = (props: GanttChartProps)=> {

  const { plantingSchedule } = props;

  const { width } = useWindowSize();
  const trueWidth = width < 960 + 32 * 2 ? width - 32 * 2 : 960

  const theme = useMantineTheme();
  const isSmallScreen = trueWidth.toString() < theme.breakpoints.md

  // Find month names and abbreviate if screen size is small
  const [headers, setHeaders] = useState<NodeListOf<Element>>();
  useEffect(() => {
    setHeaders(document.querySelectorAll('.calendar > text'));
  }, []);
  headers?.forEach((el) => {
    const maxChars = 1;
    if (el?.textContent?.length && el?.textContent?.length > maxChars && isSmallScreen) {
      el.textContent = el.textContent.substring(0, maxChars);
    }
  });

  // Remove calendar year if screen size is small
  const [calendarYear, setCalendarYear] = useState<NodeListOf<Element>>();
  useEffect(() => {
    setCalendarYear(document.querySelectorAll('.calendarTop > text'));
  }, []);
  calendarYear?.forEach((el) => {
    if (isSmallScreen) {
      el.remove()
    }
  });

  const plotToColor =   [
    theme.colors.green,
    theme.colors.yellow,
    theme.colors.blue,
    theme.colors.grape,
    theme.colors.pink,
    theme.colors.orange,
    theme.colors.violet,
    theme.colors.cyan,
    theme.colors.red,
    theme.colors.teal,
    theme.colors.lime,
    theme.colors.indigo
  ]

  const getDaysBetween = (start: Date, end: Date): number => {
    const timeBetween = start.getTime() - end.getTime();
    return Math.round(timeBetween / (1000 * 60 * 60 * 24));
  }

  const endOfYear = new Date("2025-12-31");

  const chartItems: Task[] = [];
  plantingSchedule.plots.forEach((plot: Planting[], plotIndex: number) => {
    plot.forEach((planting: Planting, plantingIndex: number) =>{
      const transplantDate = new Date(`${planting.transplantingDate}`);
      const harvestStartDate = new Date(`${planting.harvestStartDate}`);
      const harvestEndDate = new Date(`${planting.harvestEndDate}`);
      const durationBeforeHarvest = getDaysBetween(transplantDate, harvestStartDate)
      const fullDuration = getDaysBetween(transplantDate, harvestEndDate)

      const overWinters: boolean = harvestEndDate > endOfYear;

      chartItems.push({
        name: planting.name,
        type: "task",
        start: transplantDate,
        end: overWinters ? endOfYear : harvestEndDate,
        progress: 95 * durationBeforeHarvest / fullDuration,
        styles: {
          backgroundColor: plotToColor[plotIndex][9],
          backgroundSelectedColor: plotToColor[plotIndex][9],
          progressColor: plotToColor[plotIndex][6],
          progressSelectedColor: plotToColor[plotIndex][6],
        },
        id: `${plotIndex}, ${plantingIndex}`
      });
    })
  });

  const legend = plantingSchedule.plots.map((_, index) =>
    <Badge color={plotToColor[index][9]} size="lg" radius="sm">Plot {index + 1}</Badge>
  )

  const getEarliestPlantingMonth = () => {
    let earliestPlantingDate = new Date("2025-12-31");
    plantingSchedule.plots.forEach((plot: Planting[]) => {
      plot.forEach((planting: Planting) =>{
        const transplantDate = new Date(`${planting.transplantingDate}`);
        if (transplantDate < earliestPlantingDate) {
          earliestPlantingDate = transplantDate
        }
      })
    });
    // getMonth() returns index 0, (e.g. january = 0)
    return earliestPlantingDate.getMonth()
  }

  const GanttChartListTable = () => <></>
  const GanttChartListHeader = () => <></>
  const ToolTip = (props) => {
    const planting: Task = props.task;
    if (!props.task) return

    const formatDate = (date: Date):string =>
      date.toDateString().split(" ")[1] + " " + date.toDateString().split(" ")[2]

    const overWinters: boolean = planting.end === endOfYear;

    return (
      <Card withBorder>
        <Text size="sm">
          <b>{planting.name}</b>
        </Text>
        <Text size="sm">
          Plant: {formatDate(planting.start)}
        </Text>
        <Text size="sm">
          {
            overWinters ? "(overwinters)" : `Remove: ${formatDate(planting.end)}`
          }
        </Text>
      </Card>
    )
  }


  return (
    <Container className="gantt-chart" px={0} w={trueWidth}>
      <Gantt
        TooltipContent={ToolTip}
        preStepsCount={getEarliestPlantingMonth()}
        tasks={chartItems}
        headerHeight={isSmallScreen ? 25 : undefined}
        barFill={100}
        viewMode={ViewMode.Month}
        rowHeight={28}
        columnWidth={trueWidth/12}
        TaskListTable={GanttChartListTable}
        TaskListHeader={GanttChartListHeader}
      />
      <Text size="sm" mb="xs" c="dimmed" style={isSmallScreen ? undefined : {textAlign: "right"}}>
        Colors indicate what plot of land a crop is grown in. Lighter regions indicate growing time, while darker regions indicate harvests.
      </Text>
      <Flex
        gap="sm"
        justify={isSmallScreen ? "flex-start" : "flex-end"}
        wrap="wrap"
      >
        {legend}
      </Flex>
    </Container>
  )
}

export default GanttChart;
