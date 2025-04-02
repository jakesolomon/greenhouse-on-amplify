import { useState } from "react";
import {
  Button,
  Container,
  Group,
  TextInput,
  InputError,
  Center, useMantineTheme
} from '@mantine/core';
import { useForm, useField } from "@mantine/form";

import {ClimateDataOutput, UserInputs} from "../../types.ts";

import TrueLeafCropsPage from "./true-leaf-crops-page.tsx";

interface QuizProps {
  getAllCropData: (crops: string[], climateData: ClimateDataOutput) => void
  submitZipCode: (arg0: string) => Promise<void>
  climateData?: ClimateDataOutput
}

function Quiz(props: QuizProps) {

  const { getAllCropData, submitZipCode, climateData } = props;
  const hardinessZone = climateData?.hardinessZone;

  const [ formPage, setFormPage ] = useState<number>(1);

  const theme = useMantineTheme();

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
      crops: (value) => (value.length < 3 ? "Select at least three crops." : value.length > 18 ? "Select no more than eighteen crops." : null ),
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
    <Container size="xl" pb="200" pt="xl" px="0" h="30vh">
      <Center>
        <form id="quiz" onSubmit={form.onSubmit((values) => getAllCropData(values.crops, climateData!))}>
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
          <Group justify="flex-start" mt="md" mb="xl">
            {
              isFirstPage &&
              <Button
                id="submit-zip-code-button"
                onClick={proceedWithZipCode}
                disabled={!enableProceedWithZipCode}
                color={theme.colors.green[7]}
              >
                Next
              </Button>
            }
            {
              !isFirstPage &&
              <Button
                id="submit-crops-button"
                type="submit"
                disabled={!enableContinue || !climateData}
                loading={!climateData}
                color={theme.colors.green[7]}
              >
                Generate Plan
              </Button>
            }
            { form.isDirty() && form.errors['crops'] && <InputError>{form.errors['crops']}</InputError> }
          </Group>
        </form>
      </Center>
    </Container>
  );
}

export default Quiz
