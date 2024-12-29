import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

import { Planting, PlantingScheduleOutput} from '../types.ts'

interface GanttChartProps {
  plantingSchedule: PlantingScheduleOutput;
}

const GanttChart = (props: GanttChartProps)=> {

  const { plantingSchedule } = props;

  const plotToColor = [
    "green",
    "blue",
    "orange",
    "red",
    "purple",
    "grey"
  ]

  const chartItems: Task[] = [];
  plantingSchedule.plots.forEach((plot: Planting[], plotIndex: number) => {
    plot.forEach((planting: Planting) =>{
      const transplantDate = new Date(`${planting.transplantingDate}`);
      const harvestDate = new Date(`${planting.harvestEndDate}`);
      chartItems.push({
        name: planting.name,
        type: "task",
        start: transplantDate,
        end: harvestDate,
        progress: 0,
        styles: {backgroundColor: plotToColor[plotIndex] ? plotToColor[plotIndex] : "black"},
        id: `{plotIndex}, {plantingIndex}`
      });
    })
  });

  const GanttChartListTable = () => <></>
  const GanttChartListHeader = () => <></>

  return (
    <Gantt
      tasks={chartItems}
      viewMode={ViewMode.Month}
      columnWidth={80}
      TaskListTable={GanttChartListTable}
      TaskListHeader={GanttChartListHeader}
    />
  )
}

export default GanttChart;
