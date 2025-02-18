import { Gantt, Task, ViewMode } from 'gantt-task-react';
import { useEffect, useState } from "react";
import html2canvas from 'html2canvas';

import {
  Container,
  useMantineTheme,
  Badge,
  Flex,
  Text,
  Card,
  LoadingOverlay,
  Skeleton,
  HoverCard,
  Loader
} from "@mantine/core";
import "gantt-task-react/dist/index.css";

import { Planting } from '../types.ts'

import "./gantt-chart.css";
import {useViewportSize} from "@mantine/hooks";

const skeletonPlantingData: Planting[][] =
  [
    [
      {"name":"","transplantingDate": new Date("2025-03-15"),"harvestStartDate": new Date("2025-04-14"),"harvestEndDate": new Date("2025-04-28")},
      {"name":"","transplantingDate": new Date("2025-04-29"),"harvestStartDate": new Date("2025-06-13"),"harvestEndDate": new Date("2025-07-04")},
      {"name":"","transplantingDate": new Date("2025-07-05"),"harvestStartDate": new Date("2025-08-24"),"harvestEndDate": new Date("2025-09-23")},
      {"name":"","transplantingDate": new Date("2025-09-24"),"harvestStartDate": new Date("2025-10-15"),"harvestEndDate": new Date("2025-10-22")}
    ],
    [
      {"name":"","transplantingDate": new Date("2025-03-15"),"harvestStartDate": new Date("2025-04-05"),"harvestEndDate": new Date("2025-04-12")},
      {"name":"","transplantingDate": new Date("2025-05-11"),"harvestStartDate": new Date("2025-07-25"),"harvestEndDate": new Date("2025-09-23")},
      {"name":"","transplantingDate": new Date("2025-09-24"),"harvestStartDate": new Date("2025-11-08"),"harvestEndDate": new Date("2025-11-29")}
    ]
  ]

interface GanttChartProps {
  plantingSchedule?: Planting[][]
  loading: boolean
  showLoadingTimeWarning: boolean
}

const GanttChart = (props: GanttChartProps)=> {

  const { plantingSchedule = skeletonPlantingData, loading, showLoadingTimeWarning } = props;

  const { width } = useViewportSize();
  const trueWidth = width < 960 + 32 * 2 ? width - 32 * 2 : 960
  const theme = useMantineTheme();
  const isSmallScreen = trueWidth.toString() < theme.breakpoints.md

  const [ highlightedPlot, setHighlightedPlot ] = useState<string>()

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

  const loadingTimeWarning = <Text size="sm" c="dimmed">This sometimes takes a few seconds<Loader color={theme.colors.gray[5]} size="sm" ml="0.3rem" style={{ display: 'inline-flex', verticalAlign: 'top'  }}/></Text>

  // const tooltipText = `"Plots" represent individual spaces within your gardening area. Each plot groups crops that can be planted in the same area at different times. Once one crop is harvested, another from the same plot can be planted in its place.`
  const tooltipText1 = "Plots represent sections of your garden space. " +
    "For example, if you have three garden beds and your plan includes six plots, each plot would take up half of a bed."
  const tooltipText2 = "Each plot groups crops that can be planted in the same area at different times, " +
    "so once one crop is harvested, another from the same plot can be planted in its place."

  const tooltip = (text: string) => (
    <HoverCard width={400} shadow="md" closeDelay={20}>
      <HoverCard.Target>
        <u>{text}</u>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">
          {tooltipText1}
          <br/><br/>
          {tooltipText2}
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  )

  // // Remove calendar year if screen size is small
  // const [calendarYear, setCalendarYear] = useState<NodeListOf<Element>>();
  // useEffect(() => {
  //   setCalendarYear(document.querySelectorAll('.calendarTop > text'));
  // }, []);
  // calendarYear?.forEach((el) => {
  //   if (isSmallScreen) {
  //     el.remove()
  //   }
  // });

  // Fixes issue where tooltips aren't always rendered on mobile tap
  useEffect(() => {
    const ganttContainer = document.querySelector(".gantt-chart");
    if (!ganttContainer) {
      console.error("Gantt chart container not found.");
      return;
    }

    // Define the type for the last hovered task element
    let lastHoveredTask: SVGElement | null = null;

    const handleTapEvent = (event: MouseEvent) => {
      // Ensure event target is an element
      const target = event.target as Element | null;
      if (!target) return;

      // Find the closest task element
      const task = target.closest("g._KxSXS") as SVGElement | null;
      if (!task) return;

      // Trigger 'mouseleave' on the last hovered task
      if (lastHoveredTask && lastHoveredTask !== task) {
        const mouseLeaveEvent = new MouseEvent("mouseleave", { bubbles: true });
        lastHoveredTask.dispatchEvent(mouseLeaveEvent);
      }

      // Trigger 'mouseover' on the new task
      const mouseOverEvent = new MouseEvent("mouseover", { bubbles: true });
      task.dispatchEvent(mouseOverEvent);

      // Update lastHoveredTask to the current task
      lastHoveredTask = task;
    };

    // Add the tap listener to the Gantt chart container
    ganttContainer.addEventListener("click", handleTapEvent as EventListener);

    // Cleanup listener on component unmount
    return () => {
      ganttContainer.removeEventListener("click", handleTapEvent as EventListener);
    };
  }, []);



  const plotToColor = [
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
    const timeBetween = end.getTime() - start.getTime();
    return Math.round(timeBetween / (1000 * 60 * 60 * 24));
  }

  const endOfYear = new Date("2025-12-31");

  const chartItems: Task[] = [];
  plantingSchedule.forEach((plot: Planting[], plotIndex: number) => {
    const isHighlighted = plotIndex.toString() === highlightedPlot

    plot.forEach((planting: Planting, plantingIndex: number) => {
      const plantingOverWinters: boolean = planting.harvestStartDate > endOfYear;
      const harvestOverWinters: boolean = planting.harvestEndDate > endOfYear;

      const durationBeforeHarvest = getDaysBetween(planting.transplantingDate, planting.harvestStartDate)
      const fullDuration = getDaysBetween(planting.transplantingDate, planting.harvestEndDate)

      const shorteningFactorFromNYECutoff = harvestOverWinters
        ? fullDuration / getDaysBetween(planting.transplantingDate, endOfYear)
        : 1

      chartItems.push({
        name: planting.name,
        type: "task",
        start: planting.transplantingDate,
        end: harvestOverWinters ? endOfYear : planting.harvestEndDate,
        progress:
          plantingOverWinters && harvestOverWinters
            ? 100
            : harvestOverWinters
              ? 95 * durationBeforeHarvest / fullDuration * shorteningFactorFromNYECutoff
              : 95 * durationBeforeHarvest / fullDuration,
        styles: {
          backgroundColor: plotToColor[plotIndex][isHighlighted ? 6 : 9],
          backgroundSelectedColor: plotToColor[plotIndex][isHighlighted ? 6 : 9],
          progressColor: plotToColor[plotIndex][isHighlighted ? 4 : 7],
          progressSelectedColor: plotToColor[plotIndex][isHighlighted ? 4 : 7],
        },
        id: `${plotIndex}, ${plantingIndex}`
      });
    })
  });

  useEffect(() => {
    const saveImage = async () => {
      const element = document.getElementById('gantt-chart');
      const canvas = await html2canvas(element!);
      const dataUrl = canvas.toDataURL('image/png');
      localStorage.setItem("capturedImage", dataUrl);
    }

    if (!loading && plantingSchedule !== skeletonPlantingData) {
      setTimeout(saveImage, 3000); // 3000 milliseconds = 3 seconds
    }
  }, [plantingSchedule, loading])

  const handleMouseOverLegendItem = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setHighlightedPlot(e.currentTarget.id)
  }

  const legend = plantingSchedule.map((_, index) => {
    const isHighlighted = index.toString() === highlightedPlot
    return (
      <Badge
        key={index}
        id={index.toString()}
        color={plotToColor[index][isHighlighted ? 5 : 7]}
        size="lg"
        radius="sm"
        onMouseEnter={handleMouseOverLegendItem}
        onMouseLeave={() => setHighlightedPlot(undefined)}
      >
        Plot {index + 1}
      </Badge>
      )
  })

  const getEarliestPlantingMonth = () => {
    let earliestPlantingDate = new Date("2025-12-31");
    plantingSchedule.forEach((plot: Planting[]) => {
      plot.forEach((planting: Planting) =>{
        if (planting.transplantingDate < earliestPlantingDate) {
          earliestPlantingDate = planting.transplantingDate
        }
      })
    });
    // getMonth() returns index 0, (e.g. january = 0)
    return earliestPlantingDate.getMonth()
  }

  const GanttChartListTable = () => <></>
  const GanttChartListHeader = () => <></>
  const ToolTip = (props: { task: Task }) => {
    const planting: Task = props.task;
    if (!props.task) return

    const formatDate = (date: Date):string =>
      date.toDateString().split(" ")[1] + " " + date.toDateString().split(" ")[2]

    const overWinters: boolean = planting.end === endOfYear;
    const harvestStartDate = plantingSchedule.flat().find(p => p.name === planting.name)?.harvestStartDate
    const harvestEndDate = plantingSchedule.flat().find(p => p.name === planting.name)?.harvestEndDate

    return (
      <Card withBorder style={isSmallScreen ? {position: "fixed", top: 0, left: 0} : undefined}>
        <Text size="sm">
          <b>{planting.name}</b>
        </Text>
        <Text size="sm">
          Plant: {formatDate(planting.start)}
        </Text>
        <Text size="sm">
          {
            overWinters
            ? "(overwinters)"
            : harvestStartDate && harvestEndDate
            ? `Harvest: ${formatDate(harvestStartDate!)}-${formatDate(harvestEndDate)}`
            : `Remove: ${formatDate(planting.end)}`
          }
        </Text>
      </Card>
    )
  }

  return (
    <Container pos="relative" className="gantt-chart" px={0} w={trueWidth}>

      {/*Render copy of gantt chart off screen to screenshot for full plan*/}
      <div
        id="gantt-chart"
        style={{
          position: "absolute",
          top: "-9999px", // Move it off-screen
          left: "-9999px",
          width: "1200px", // Adjust as needed
          // height: "400px",
        }}
      >
        <Gantt
          TooltipContent={ToolTip}
          preStepsCount={getEarliestPlantingMonth()}
          tasks={chartItems}
          barFill={95}
          viewMode={ViewMode.Month}
          rowHeight={28}
          columnWidth={1200 / 12}
          TaskListTable={GanttChartListTable}
          TaskListHeader={GanttChartListHeader}
        />
        <Flex
          gap="sm"
          justify={isSmallScreen ? "flex-start" : "flex-end"}
          wrap="wrap"
          my="xs"
        >
          {legend}
        </Flex>
      </div>

      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{backgroundOpacity: 0.4}} loaderProps={{
        color: theme.colors.gray[4],
        children: showLoadingTimeWarning ? loadingTimeWarning : undefined
      }}/>
      <Skeleton visible={loading} style={{backgroundColor: "#fff"}}>
        <Gantt
          TooltipContent={ToolTip}
          preStepsCount={getEarliestPlantingMonth()}
          tasks={chartItems}
          // headerHeight={isSmallScreen ? 25 : undefined}
          barFill={95}
          viewMode={ViewMode.Month}
          rowHeight={28}
          columnWidth={trueWidth / 12}
          TaskListTable={GanttChartListTable}
          TaskListHeader={GanttChartListHeader}
        />
        <Text size="sm" c="dimmed" style={isSmallScreen ? undefined : {textAlign: "right"}}>
          {/*Colors indicate {tooltip("what plot of land a crop is grown in")}.<IconInfoCircle size="1rem" /> Lighter regions indicate growing time, while darker regions indicate harvests.*/}
          {/*Colors indicate what plot of land a crop is grown in, where each plot represent a sub-division of your gardening space. For example, if you have three garden beds, and your plan uses six plots, each plot represents one half of a garden bed. Lighter regions indicate growing time, while darker regions indicate harvests.*/}
          Colors indicate what plot of land a crop is grown in {tooltip("(what are plots?)")}. Lighter regions
          indicate
          growing time, while darker regions indicate harvests.
        </Text>
        <Flex
          gap="sm"
          justify={isSmallScreen ? "flex-start" : "flex-end"}
          wrap="wrap"
          my="xs"
        >
          {legend}
        </Flex>
      </Skeleton>
    </Container>
  )
}

export default GanttChart;
