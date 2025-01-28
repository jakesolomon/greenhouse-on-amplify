import { useEffect } from 'react';
import {
  Container,
  Group,
  useMantineTheme,
  Text,
  Loader,
  Chip,
  InputLabel
} from '@mantine/core';

import { cropTypes } from "../../helpers/crop-types.ts";
import {useViewportSize} from "@mantine/hooks";

interface CropsPageProps {
  inputKey: string;
  inputProps: object;
  setFieldValue: (fieldValue: string[]) => void;
  value: string[];
  hardinessZone?: number;
}

function TrueLeafCropsPage(props: CropsPageProps) {

  const { inputKey, inputProps, setFieldValue, value, hardinessZone } = props;

  useEffect(() => {
    if (hardinessZone !== undefined) {
      setFieldValue(value.filter((v) =>
        cropTypes[v].idealHardinessZones.includes(hardinessZone)));
    }
  }, [
    hardinessZone
  ])

  const { width } = useViewportSize();
  const trueWidth = width < 960 + 32 * 2 ? width - 32 * 2 : 960
  const theme = useMantineTheme();
  const isSmallScreen = trueWidth.toString() < theme.breakpoints.md

  const renderChips = (_hardinessZone?: number) =>
    Object.keys(cropTypes).map(crop => {
      const disabled = !!_hardinessZone && !cropTypes[crop].idealHardinessZones.includes(_hardinessZone)
      return (
        <Chip
          w={isSmallScreen ? undefined : "14rem"}
          style={isSmallScreen ? {minWidth: "7rem"} : undefined}
          pb={isSmallScreen ? "xs" : undefined}
          key={crop}
          value={crop}
          disabled={disabled}
          checked={false}
        >
          {crop}
        </Chip>
      )
  })
  // See https://mantine.dev/form/use-form/#values for info on handling list values

  return (
    <Container size="sm" px="0">
      <InputLabel>What crops are you interested in growing?</InputLabel>
      <Text c="dimmed" size="sm" mb="md" >{
        hardinessZone
          ? <>USDA Plant Hardiness Zone {hardinessZone} found for your location. Unsuitable crops are disabled.</>
          : <>Finding your USDA Plant Hardiness Zone <Loader color={theme.colors.gray[6]} type="dots" size="sm" ml="0.3rem" style={{ display: 'inline-flex', verticalAlign: 'top'  }}/></>
      }</Text>
      <Chip.Group
        multiple
        // value={value}
        // onChange={setValue}
        key={inputKey}
        {...inputProps}
      >
        <Group justify="space-between">
          {renderChips(hardinessZone)}
        </Group>
      </Chip.Group>
    </Container>
  );
}

export default TrueLeafCropsPage;
