import {Button, Group, TextInput, useMantineTheme} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Schema } from "../../amplify/data/resource.ts";
import {generateClient} from "aws-amplify/api";

interface EmailOptInFormProps {
  setUserData: ( userName: string, userEmail: string ) => void
}

const EmailOptInForm = (props: EmailOptInFormProps) => {

  const { setUserData } = props

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
    // TODO should I set user data based on return value of API request ?
    const result = await amplifyClient.queries.sendPrivySignup({ emailAddress: form.getValues().email, url: window.location.href });
    setUserData(values.name, values.email)
    console.log(result)
  };


  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <TextInput
        label="Name"
        placeholder="As you'd like it to show on your guide"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />
      <TextInput
        label="Email"
        placeholder="your@email.com"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit" color={theme.colors.green[7]} >Continue</Button>
      </Group>
    </form>
  )
}

export default EmailOptInForm
