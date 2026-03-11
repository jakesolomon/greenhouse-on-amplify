import { useEffect, useState } from 'react';
import {
  Container,
  Group,
  useMantineTheme,
  Text,
  Loader,
  Chip,
  InputLabel,
  HoverCard,
  Accordion,
  Badge,
  ActionIcon,
  Modal,
  Radio,
  Button,
  Stack,
} from '@mantine/core';

import { cropTypes } from "../../helpers/crop-types.ts";
import { useViewportSize } from "@mantine/hooks";
import { IconHelpCircle, IconPlus, IconX } from "@tabler/icons-react";

// TODO review these categories
const cropCategories: Record<string, string[]> = {
  "Leafy Greens": ["Cabbage", "Collard", "Kale", "Lettuce", "Spinach", "Chard", "Brussels Sprouts"],
  "Root Vegetables": ["Beet", "Carrot", "Garlic", "Leek", "Onion", "Potato", "Radish (spring)", "Radish (winter)", "Turnip"],
  "Beans & Peas": ["Bean (shell)", "Green Bean", "Pea (shelling)", "Pea (snap)"],
  "Squash & Fruiting": ["Butternut Squash", "Corn", "Cucumber", "Eggplant", "Okra", "Pepper (sweet)", "Pepper (hot)", "Pumpkin", "Tomato", "Watermelon", "Zucchini"],
  "Brassicas & Others": ["Broccoli", "Cauliflower", "Celery", "Green Onion"],
};

interface CropsPageProps {
  inputKey: string;
  inputProps: object;
  setFieldValue: (fieldValue: string[]) => void;
  value: string[];
  hardinessZone?: number;
}

function TrueLeafCropsPage(props: CropsPageProps) {

  const { inputKey, inputProps, setFieldValue, value, hardinessZone } = props;

  const [surveyModalCrop, setSurveyModalCrop] = useState<string | null>(null);
  const [surveyAnswer, setSurveyAnswer] = useState<string | null>(null);
  const [surveySubmitted, setSurveySubmitted] = useState(false);

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

  const tooltipText = "USDA Plant Hardiness Zones divide regions by their average winter temperatures, helping gardeners choose plants that can handle their local climate. Knowing your zone ensures you plant crops that will grow successfully in your area."

  const tooltip = (text: string) => (
    <HoverCard width={400} shadow="md" closeDelay={20}>
      <HoverCard.Target>
        <u>{text}</u>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">
          {tooltipText}
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  )

  const selectedCountForCategory = (crops: string[]) =>
    crops.filter(c => value.includes(c)).length;

  const removeCrop = (crop: string) => {
    setFieldValue(value.filter(v => v !== crop));
  };

  const handlePlusClick = (crop: string) => {
    console.log(`[CropSelection] Plus button clicked for: ${crop}`);
    setSurveyAnswer(null);
    setSurveySubmitted(false);
    setSurveyModalCrop(crop);
  //   TODO track this
  };

  const handleSurveySubmit = () => {
    console.log(`[CropSelection] Survey response for "${surveyModalCrop}": ${surveyAnswer}`);
    setSurveySubmitted(true);
  //   TODO capture this with lambda function
  };

  const closeModal = () => {
    setSurveyModalCrop(null);
    setSurveyAnswer(null);
    setSurveySubmitted(false);
  };

  const renderCategoryChips = (crops: string[]) =>
    crops.map(crop => {
      const disabled = !!hardinessZone && !cropTypes[crop].idealHardinessZones.includes(hardinessZone)
      return (
        <Chip
          w={isSmallScreen ? undefined : "14rem"}
          style={isSmallScreen ? { minWidth: "7rem" } : undefined}
          pb={isSmallScreen ? "xs" : undefined}
          key={crop}
          value={crop}
          disabled={disabled}
          checked={false}
          color={theme.colors.green[7]}
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
          ? <>{tooltip(`USDA Plant Hardiness Zone ${hardinessZone}`)}<IconHelpCircle size="1rem" /> found for your location. Unsuitable crops are disabled.</>
          : <>Finding your USDA Plant Hardiness Zone <Loader color={theme.colors.gray[6]} type="dots" size="sm" ml="0.3rem" style={{ display: 'inline-flex', verticalAlign: 'top' }} /></>
      }</Text>
      <Chip.Group
        multiple
        key={inputKey}
        {...inputProps}
      >
        <Accordion multiple variant="contained" defaultValue={[]}>
          {Object.entries(cropCategories).map(([category, crops]) => {
            const count = selectedCountForCategory(crops);
            return (
              <Accordion.Item key={category} value={category}>
                <Accordion.Control>
                  <Group gap="sm">
                    <Text fw={500}>{category}</Text>
                    {count > 0 && (
                      <Badge size="sm" color={theme.colors.green[7]} variant="filled">
                        {count} selected
                      </Badge>
                    )}
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Group justify="flex-start">
                    {renderCategoryChips(crops)}
                  </Group>
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Chip.Group>

      {value.length > 0 && (
        <div style={{ borderTop: `1px solid ${theme.colors.gray[3]}`, paddingTop: 20, marginTop: 'var(--mantine-spacing-lg)' }}>
          <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb="xs" style={{ letterSpacing: 0.5 }}>Selected Crops</Text>
          <Group wrap="wrap" gap="xs">
            {value.map(crop => (
              <Group key={crop} gap={8} px="md" py={4}
                style={{ borderRadius: 999, border: `1px solid ${theme.colors.gray[3]}`, flexWrap: 'nowrap' }}
              >
                <Text size="sm" style={{ whiteSpace: 'nowrap' }}>{crop}</Text>
                <Badge variant="light" color="gray" size="xs">&times; 1</Badge>
                <ActionIcon
                  variant="light"
                  color="green"
                  size="xs"
                  radius="xl"
                  onClick={() => handlePlusClick(crop)}
                  aria-label={`Add more ${crop}`}
                >
                  <IconPlus size={12} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="xs"
                  radius="xl"
                  onClick={() => removeCrop(crop)}
                  aria-label={`Remove ${crop}`}
                >
                  <IconX size={12} />
                </ActionIcon>
              </Group>
            ))}
          </Group>
        </div>
      )}

      <Modal
        opened={surveyModalCrop !== null}
        onClose={closeModal}
        title="Multiple Plantings"
        centered
        size={420}
      >
        {surveySubmitted ? (
          <Stack>
            <Text size="sm">Thanks — your feedback helps us prioritize.</Text>
            <Group justify="flex-end">
              <Button color={theme.colors.green[7]} onClick={closeModal}>Close</Button>
            </Group>
          </Stack>
        ) : (
          <Stack>
            <Text size="sm">
              Adding multiple plantings of the same crop isn't available yet. Help us prioritize by answering a quick question:
            </Text>
            <Text fw={500} size="sm">
              Were you looking to plant {surveyModalCrop} multiple times for staggered harvests?
            </Text>
            <Radio.Group value={surveyAnswer ?? ''} onChange={setSurveyAnswer}>
              <Stack gap="xs">
                <Radio value="staggered" label="Yes, I want staggered harvests of this crop" />
                <Radio value="exploring" label="No, just exploring" />
                <Radio value="other" label="Something else" />
              </Stack>
            </Radio.Group>
            <Group justify="flex-end">
              <Button variant="subtle" color="gray" onClick={closeModal}>Skip</Button>
              <Button
                color={surveyAnswer ? theme.colors.green[7] : 'gray'}
                disabled={!surveyAnswer}
                onClick={handleSurveySubmit}
              >
                Submit
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}

export default TrueLeafCropsPage;
