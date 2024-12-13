import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

import { Crop } from '../types.ts'

interface GanttChartProps {
  crops: Crop[];
}

const GanttChart = (props: GanttChartProps)=> {

  const { crops } = props;

  const chartItems: Task[] = crops.map((crop): Task => ({
    name: crop.name,
    type: "task",
    start: new Date(2025, crop.plantingDate.month, crop.plantingDate.day),
    end: new Date(2025, crop.harvestDate.month, crop.harvestDate.day),
    progress: 0,
    id: crop.name
  }))

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
