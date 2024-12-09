import { useState } from "react";
import {Autocomplete, Button, Chip, Container, Group, Select} from '@mantine/core';
import { useForm } from "@mantine/form";
import { nprogress } from '@mantine/nprogress';

import { hardinessZones, plotTypes, goals } from "./input-types.ts";

function Quiz() {

  const [ formPage, setFormPage ] = useState<number>(1);

  const nextFormPage = () => {
    setFormPage(formPage + 1);
    nprogress.set((formPage)/numberOfPages * 100)
  }

  const form = useForm({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: {
      plantHardinessZone: '',
      plotType: '',
      goal: Array(goals.length).fill(''),
    },

    validate: {
      plantHardinessZone: (value) => (hardinessZones.includes(value) ? null : 'Enter a valid plant hardiness zone'),
      plotType: (value) => (plotTypes.includes(value) ? null : 'Select a valid plot type'),
      goal: (value) => (value.length !== 0 ? null : 'Select at least one goal'),
    },
  });

  const formInputByPage: Record<number, string> = {
    1: 'plantHardinessZone',
    2: 'plotType',
    3: 'goal'
  }

  const currentInput = formInputByPage[formPage];
  const currentInputIsValid = form.isValid(currentInput);
  const currentInputIsDirty = form.isDirty(currentInput);
  const enableContinue = currentInputIsValid && currentInputIsDirty
  const numberOfPages = Object.keys(formInputByPage).length;
  const isLastPage = formPage === numberOfPages;

  const renderChips = goals.map(goal =>
    <Chip
      key={goals.indexOf(goal)}
      value={goal}
      onChange={(checked) => form.replaceListItem('goal', goals.indexOf(goal), checked ? goal : '')}
    >
      {goal}
    </Chip>
  );

  return (
    <Container size="xl" w={500}>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>

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
          <Chip.Group multiple >
            <Group justify="center">
              {renderChips}
            </Group>
          </Chip.Group>
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
