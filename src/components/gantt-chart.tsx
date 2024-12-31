import { Gantt, Task, ViewMode } from 'gantt-task-react';
import {useEffect, useState} from "react";
import { Container, useMantineTheme } from "@mantine/core";
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

  const plotToColor = [
    "green",
    "blue",
    "orange",
    "red",
    "purple",
    "grey"
  ]

  const chartItems: Task[] = [];
  let earliestPlantingDate = new Date("2025-11-31");
  plantingSchedule.plots.forEach((plot: Planting[], plotIndex: number) => {
    plot.forEach((planting: Planting, plantingIndex: number) =>{
      const transplantDate = new Date(`${planting.transplantingDate}`);
      const harvestDate = new Date(`${planting.harvestEndDate}`);
      chartItems.push({
        name: planting.name,
        type: "task",
        start: transplantDate,
        end: harvestDate,
        progress: 0,
        styles: {backgroundColor: plotToColor[plotIndex] ? plotToColor[plotIndex] : "black"},
        id: `${plotIndex}, ${plantingIndex}`
      });
      if (transplantDate < earliestPlantingDate) {
        earliestPlantingDate = transplantDate
      }
    })
  });

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

  return (
    <Container className="gantt-chart" px={0} w={trueWidth}>
      <Gantt
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
    </Container>
  )
}

export default GanttChart;
