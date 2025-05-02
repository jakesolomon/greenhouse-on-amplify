import {Button, Checkbox, Group, TextInput, useMantineTheme} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Schema } from "../../amplify/data/resource.ts";
import {generateClient} from "aws-amplify/api";
import {useState} from "react";

interface EmailOptInFormProps {
  setUserData: ( userName: string, userEmail: string ) => void
}

const EmailOptInForm = (props: EmailOptInFormProps) => {

  const { setUserData } = props

  const [ sendingUserData, setSendingUserData ] = useState(false)

  const amplifyClient = generateClient<Schema>()
  const theme = useMantineTheme();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
    },

    validate: {
      name: (value) => (value.length === 0 ? "Please provide your name." : null ),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async (values: { name: string, email: string }) => {
    setSendingUserData(true)
    // TODO should I set user data based on return value of API request ?
    const result = await amplifyClient.queries.sendPrivySignup({ emailAddress: form.getValues().email, url: window.location.href });
    setUserData(values.name, values.email)
    console.log(result)
    setSendingUserData(false)
  };


  return (
    <form id="email-opt-in" onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <TextInput
        disabled={sendingUserData}
        label="Name"
        placeholder="Your name"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />
      <TextInput
        disabled={sendingUserData}
        label="Email"
        placeholder="your@email.com"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />
      <Checkbox
        mt="md"
        disabled
        checked
        label="Agree to receive the occasional email from us. We don't give your data to anyone."
        key={form.key('checkbox')}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit" color={theme.colors.green[7]} loading={sendingUserData}>Continue</Button>
      </Group>
    </form>
  )
}

export default EmailOptInForm
