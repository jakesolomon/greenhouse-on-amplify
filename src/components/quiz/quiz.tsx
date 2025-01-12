import { useState } from "react";
import {
  Button,
  Container,
  Group,
  TextInput,
  Flex,
  InputError
} from '@mantine/core';
import { useForm, useField } from "@mantine/form";

import { UserInputs } from "../../types.ts";

import TrueLeafCropsPage from "./true-leaf-crops-page.tsx";

interface QuizProps {
  getAllCropData: (arg0: string[]) => void
  submitZipCode: (arg0: string) => Promise<void>
  hardinessZone?: number
}

function Quiz(props: QuizProps) {

  const { getAllCropData, submitZipCode, hardinessZone } = props;

  const [ formPage, setFormPage ] = useState<number>(1);

  const nextFormPage = () => {
    setFormPage(formPage + 1);
  }

  const form = useForm<UserInputs>({
    mode: 'controlled',
    validateInputOnChange: true,
    initialValues: {
      crops: [],
    },

    validate: {
      crops: (value) => (value.length < 3 ? "Select at least three crops." : null )
    },
  });

  const formInputByPage: Record<number, string> = {
    2: 'crops',
  }

  const currentInput = formInputByPage[formPage];
  const currentInputIsValid = form.isValid(currentInput);
  const currentInputIsDirty = form.isDirty(currentInput);
  const enableContinue = currentInputIsValid && currentInputIsDirty
  const isFirstPage = formPage === 1;

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
    <Container size="xl" pt="xl">
      <Flex align="center">
        <form onSubmit={form.onSubmit((values) => getAllCropData(values.crops))}>
          {
            (formPage === 1) &&
            <TextInput
              description="This will be used to predict climate data for your location."
              label="What is your ZIP code?"
              placeholder="#####"
              {...zipCodeField.getInputProps()}
            />
          }
          {
            (formPage === 2) &&
            <TrueLeafCropsPage
              inputKey={form.key('crops')}
              inputProps={{...form.getInputProps('crops')}}
              setFieldValue={(value) => form.setFieldValue('crops', value)}
              value={form.getValues().crops}
              hardinessZone={hardinessZone}
            />
          }
          <Group justify="flex-start" mt="md">
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
              !isFirstPage &&
              <Button
                type="submit"
                disabled={!enableContinue}
              >
                Next
              </Button>
            }
            { form.isDirty() && form.errors['crops'] && <InputError>{form.errors['crops']}</InputError> }
          </Group>
        </form>
      </Flex>
    </Container>
  );
}

export default Quiz
