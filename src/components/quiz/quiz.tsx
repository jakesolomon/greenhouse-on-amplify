import { useState } from "react";
import { Autocomplete, Button, Chip, Container, Group, Select, Slider, InputLabel, InputError } from '@mantine/core';
import { useForm } from "@mantine/form";
import { nprogress } from '@mantine/nprogress';

import { generateGptPrompFrom, UserInputs } from '../../GPT/gpt-helpers.ts'

import { hardinessZones, plotTypes, goals } from "./input-types.ts";
import CropsPage from "./crops-page.tsx";

interface QuizProps {
  sendUserInputsToLLM: (arg0: string) => Promise<void>;
}

function Quiz(props: QuizProps) {

  const { sendUserInputsToLLM } = props;

  const [ formPage, setFormPage ] = useState<number>(1);

  const nextFormPage = () => {
    setFormPage(formPage + 1);
    nprogress.set((formPage)/numberOfPages * 100)
  }

  const form = useForm<UserInputs>({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: {
      plantHardinessZone: '',
      plotType: '',
      goal: [],
      sunlight: -1,
      crop: [],
    },

    validate: {
      plantHardinessZone: (value) => (hardinessZones.includes(value) ? null : 'Enter a valid plant hardiness zone.'),
      plotType: (value) => (plotTypes.includes(value) ? null : 'Select a valid plot type.'),
      goal: (value) => (value.length === 0 ? "Select at least one goal." : value.length > 3 ? "Select no more than three goals to prioritize." : null),
      sunlight: () => null,
      crop: (value) => (value.length === 0 ? "Select at least one crop." : null )
    },
  });

  const formInputByPage: Record<number, string> = {
    1: 'plantHardinessZone',
    2: 'plotType',
    3: 'goal',
    4: 'sunlight',
    5: 'crop',
  }

  const currentInput = formInputByPage[formPage];
  const currentInputIsValid = form.isValid(currentInput);
  const currentInputIsDirty = form.isDirty(currentInput);
  const enableContinue = currentInputIsValid && currentInputIsDirty
  const numberOfPages = Object.keys(formInputByPage).length;
  const isLastPage = formPage === numberOfPages;

  const renderChips = goals.map(goal =>
    // See https://mantine.dev/form/use-form/#values for info on handling list values
    <Chip
      key={goals.indexOf(goal)}
      value={goal}
    >
      {goal}
    </Chip>
  );

  return (
    <Container size="xl" w={500}>
      <form onSubmit={form.onSubmit((values) => sendUserInputsToLLM(generateGptPrompFrom(values)))}>

        {
          (formPage === 1) &&
          <Autocomplete
            label="What is your plant hardiness zone?"
            placeholder="6b"
            data={hardinessZones}
            key={form.key('plantHardinessZone')}
            {...form.getInputProps('plantHardinessZone')}
          />
        }
        {
          (formPage === 2) &&
          <Select
            label="What type of garden will you have?"
            placeholder="Pick value"
            data={plotTypes}
            key={form.key('plotType')}
            {...form.getInputProps('plotType')}
          />
        }
        {
          (formPage === 3) &&
          <>
            <InputLabel>What are your highest priorities for your garden?</InputLabel>
            <Chip.Group
              multiple
              key={form.key('goal')}
              {...form.getInputProps('goal')}
            >
              <Group justify="center">
                {renderChips}
              </Group>
            </Chip.Group>
            { form.errors['goal'] && <InputError>{form.errors['goal']}</InputError> }
          </>
        }
        {
          (formPage === 4) &&
          <>
            <InputLabel>How many hours of direct sunlight does your garden get each day?</InputLabel>
            <Slider
              min={0}
              max={16}
              marks={[
                { value: 0, label: '0' },
                { value: 4, label: '4' },
                { value: 8, label: '8' },
                { value: 12, label: '12' },
                { value: 16, label: '16' },
              ]}
              key={form.key('sunlight')}
              {...form.getInputProps('sunlight')}
              mb="xl"
            />
          </>
        }
        {
          (formPage === 5) &&
          <CropsPage
            inputKey={form.key('crop')}
            inputProps={{...form.getInputProps('crop')}}
            setFieldValue={(value) => form.setFieldValue('crop', value)}
            plantHardinessZone={form.getValues()['plantHardinessZone']}
          />
        }
        <Group justify="flex-end" mt="md">
          {
            !isLastPage &&
            <Button
              onClick={nextFormPage}
              disabled={!enableContinue}
            >
              Next
            </Button>
          }
          {
            isLastPage &&
            <Button
              type="submit"
              disabled={!enableContinue}
            >
              Submit
            </Button>
          }
        </Group>
      </form>
    </Container>
  );
}

export default Quiz
