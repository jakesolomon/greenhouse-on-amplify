import {
  Button,
  Container,
  Group,
  InputLabel,
  Chip,
  Stack
} from '@mantine/core';
import { useField } from "@mantine/form";

import { goals } from "./input-types.ts";

interface FakeQuizQuestionProps {
  proceed: () => void
}

function FakeQuizQuestion(props: FakeQuizQuestionProps) {

  const { proceed } = props;

  const renderChips = goals.map(goal =>
    // See https://mantine.dev/form/use-form/#values for info on handling list values
    <Chip
      key={goals.indexOf(goal)}
      value={goal}
    >
      {goal}
    </Chip>
  );

  const goalField = useField({
    initialValue: [],
    validateOnChange: true,
    validate: (value)  => (value.length === 0 ? "Select at least one goal." : value.length > 3 ? "Select no more than three goals to prioritize." : null),
  })

  const enableProceed = goalField.isDirty() && goalField.getValue().length > 0;

  return (
    <Container size="xs">
      <Stack>
        <InputLabel>What are your highest priorities for your garden?</InputLabel>
        <Chip.Group
          multiple
          key={goalField.key}
          {...goalField.getInputProps()}
        >
          <Group justify="center">
            {renderChips}
          </Group>
        </Chip.Group>
        {/*{ goalField.renderChips && <InputError>{goalField.errors['goal']}</InputError> }*/}
        <Group justify="flex-end" mt="md">
          <Button
            onClick={proceed}
            disabled={!enableProceed}
          >
            Submit
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

export default FakeQuizQuestion
