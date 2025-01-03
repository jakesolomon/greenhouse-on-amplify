import {Table, Text, Container, useMantineTheme} from '@mantine/core';
import { ClimateDataOutput} from "../types.ts";
import useWindowSize from "../helpers/useWindowSize.ts";

interface ClimateChartProps {
  data: ClimateDataOutput
}

const ClimateChart = (props: ClimateChartProps) => {
  const { data } = props;
  const { temperatureData } = data;

  const { width } = useWindowSize();
  const trueWidth = width < 960 + 32 * 2 ? width - 32 * 2 : 960

  const theme = useMantineTheme();
  const isSmallScreen = trueWidth.toString() < theme.breakpoints.md

  const abbreviateMonth = (month: string) =>
    isSmallScreen
      ? month.slice(0, 1)
      : month.length > 5
        ? month.slice(0,3)
        : month;

  const horizontalHeaders = temperatureData?.map(e => (
    <Table.Th key={temperatureData.indexOf(e)}>{abbreviateMonth(e.month)}</Table.Th>
  ))

  const horizontalHighRows = temperatureData?.map(e => (
      <Table.Td key={temperatureData.indexOf(e)}>{e.temps.avgHigh}</Table.Td>
  ))

  const horizontalLowRows = temperatureData?.map(e => (
    <Table.Td key={temperatureData.indexOf(e)}>{e.temps.avgLow}</Table.Td>
  ))

  const horizontalTable = (
    <Table layout="fixed" withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th></Table.Th>
          {horizontalHeaders}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>High</Table.Th>
          {horizontalHighRows}
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Low</Table.Th>
          {horizontalLowRows}
        </Table.Tr>
      </Table.Tbody>
    </Table>
  )

  const verticalRows = temperatureData.map((element) => (
    <Table.Tr key={element.month}>
      <Table.Th>{element.month}</Table.Th>
      <Table.Td>{element.temps.avgLow}</Table.Td>
      <Table.Td>{element.temps.avgHigh}</Table.Td>
    </Table.Tr>
  ));

  const verticalTable = (
    <Table withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th></Table.Th>
          <Table.Th>Low</Table.Th>
          <Table.Th>High</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{verticalRows}</Table.Tbody>
    </Table>
  )

  return (
    <Container m="lg" px={0} mx={0}>
      <Text mb="sm">
        Based on the ZIP code you provided, the following estimates have been made about average temperatures in your area. These predictions were then used to inform planting times.
      </Text>
      <Text mb="lg">Estimated date for last spring frost is <b>{data.lastFrostDate}</b>, and the first autumn frost is <b>{data.firstFrostDate}</b>.</Text>
      {
        isSmallScreen
          ? verticalTable
          : horizontalTable
      }
    </Container>
  );
};

export default ClimateChart;

