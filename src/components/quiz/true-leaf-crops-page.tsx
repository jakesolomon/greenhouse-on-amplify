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

import { trueLeafCropTypes } from "../../helpers/true-leaf-crop-types.ts";

import './true-leaf-crops-page.css'

interface CropsPageProps {
  inputKey: string;
  inputProps: object;
  setFieldValue: (fieldValue: string[]) => void;
  value: string[];
  hardinessZone?: number;
}

function TrueLeafCropsPage(props: CropsPageProps) {

  const { inputKey, inputProps, setFieldValue, value, hardinessZone } = props;

  const theme = useMantineTheme();

  useEffect(() => {
    if (hardinessZone !== undefined) {
      setFieldValue(value.filter((v) =>
        trueLeafCropTypes[v].idealHardinessZones.includes(hardinessZone)));
    }
  }, [
    hardinessZone
  ])

  const renderChips = (_hardinessZone?: number) =>
    Object.keys(trueLeafCropTypes).map(crop => {
      const disabled = !!_hardinessZone && !trueLeafCropTypes[crop].idealHardinessZones.includes(_hardinessZone)
      const chipClass = !_hardinessZone || disabled ? undefined : "suitable"
      return (
        <Chip
          w="12rem"
          key={crop}
          value={crop}
          className={chipClass}
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
          ? <>USDA Plant Hardiness Zone {hardinessZone} found for your location. Suitable crops are highlighted in green.</>
          : <>Finding your USDA Plant Hardiness Zone <Loader color={theme.colors.gray[6]} type="dots" size="sm" ml="0.3rem" style={{ display: 'inline-flex', verticalAlign: 'top'  }}/></>
      }</Text>
      <Chip.Group
        multiple
        // value={value}
        // onChange={setValue}
        key={inputKey}
        {...inputProps}
      >
        <Group justify="left">
          {renderChips(hardinessZone)}
        </Group>
      </Chip.Group>
    </Container>
  );
}

export default TrueLeafCropsPage;
