import { useState } from "react";
import { Autocomplete, Button, Chip, Container, Group, Select, Slider, InputLabel, InputError, TextInput } from '@mantine/core';
import { useForm, useField } from "@mantine/form";
import { nprogress } from '@mantine/nprogress';

import { generateLlmCropDataPromptFrom } from '../../LLM/get-crop-data-prompt.ts'
import { UserInputs } from "../../types.ts";

import { hardinessZones, plotTypes, goals } from "./input-types.ts";
import CropsPage from "./crops-page.tsx";

interface QuizProps {
  requestCropData: (arg0: string) => Promise<void>
  submitZipCode: (arg0: string) => Promise<void>
}

function Quiz(props: QuizProps) {

  const { requestCropData, submitZipCode } = props;

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
      gardenAreas: [{length: 10, width: 3}, {length: 10, width: 3}],
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
    2: 'plantHardinessZone',
    3: 'plotType',
    4: 'goal',
    5: 'sunlight',
    6: 'crop',
  }

  const currentInput = formInputByPage[formPage];
  const currentInputIsValid = form.isValid(currentInput);
  const currentInputIsDirty = form.isDirty(currentInput);
  const enableContinue = currentInputIsValid && currentInputIsDirty
  const numberOfPages = Object.keys(formInputByPage).length;
  const isLastPage = formPage === 6;
  const isFirstPage = formPage === 1;

  const renderChips = goals.map(goal =>
    // See https://mantine.dev/form/use-form/#values for info on handling list values
    <Chip
      key={goals.indexOf(goal)}
      value={goal}
    >
      {goal}
    </Chip>
  );

  const zipCodeRegex = /^\d{5}(-\d{4})?$/;
  const zipCodeField = useField({
    initialValue: '',
    validate: (value) => ( zipCodeRegex.test(value) ? null : 'Please enter a valid ZIP code.' )
  });
  const enableProceedWithZipCode = zipCodeField.isDirty() && zipCodeRegex.test(zipCodeField.getValue())
  const proceedWithZipCode = () => {
    submitZipCode(zipCodeField.getValue());
    nextFormPage()
  }

  return (
    <Container size="xl" w={500}>
      <form onSubmit={form.onSubmit((values) => requestCropData(generateLlmCropDataPromptFrom(values)))}>
        {
          (formPage === 1) &&
          <TextInput
            description="This will be used to predict climate data for your location."
            label="What is your ZIP code?"
            placeholder="00000"
            {...zipCodeField.getInputProps()}
          />
        }
        {
          (formPage === 2) &&
          <Autocomplete
            label="What is your plant hardiness zone?"
            placeholder="6b"
            data={hardinessZones}
            key={form.key('plantHardinessZone')}
            {...form.getInputProps('plantHardinessZone')}
          />
        }
        {
          (formPage === 3) &&
          <Select
            label="What type of garden will you have?"
            placeholder="Pick value"
            data={plotTypes}
            key={form.key('plotType')}
            {...form.getInputProps('plotType')}
          />
        }
        {
          (formPage === 4) &&
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
          (formPage === 5) &&
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
          (formPage === 6) &&
          <CropsPage
            inputKey={form.key('crop')}
            inputProps={{...form.getInputProps('crop')}}
            setFieldValue={(value) => form.setFieldValue('crop', value)}
            plantHardinessZone={form.getValues()['plantHardinessZone']}
          />
        }
        <Group justify="flex-end" mt="md">
          {
            isFirstPage &&
            <Button
              onClick={proceedWithZipCode}
              disabled={!enableProceedWithZipCode}
            >
              Next
            </Button>
          }
          {
            !isLastPage && !isFirstPage &&
            <Button
              onClick={nextFormPage}
              disabled={!enableContinue}
            >
              Next
            </Button>
          }
          {
            isLastPage && !isFirstPage &&
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
