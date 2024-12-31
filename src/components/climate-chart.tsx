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

  const headers = temperatureData?.map(e => (
    <Table.Th key={temperatureData.indexOf(e)}>{abbreviateMonth(e.month)}</Table.Th>
  ))

  const rows = temperatureData?.map(e => (
    <Table.Td key={temperatureData.indexOf(e)}>
      <Table.Tr>{e.temps.avgHigh}</Table.Tr>
      <Table.Tr>{e.temps.avgLow}</Table.Tr>
    </Table.Td>
  ))

  return (
    <Container m="lg" px={0} mx={0}>
      <Text size="sm" mb="lg">
        Based on the ZIP code you provided, the following estimates have been made about average temperatures in your area. These predictions were then used to inform planting times.
      </Text>
      <Table layout="fixed" withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Tr></Table.Tr>
            {headers}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Td>
            <Table.Tr>{isSmallScreen ? "H" : "High"}</Table.Tr>
            <Table.Tr>{isSmallScreen ? "L" : "Low"}</Table.Tr>
          </Table.Td>
          {rows}
        </Table.Tbody>
      </Table>
    </Container>
  );
};

export default ClimateChart;

