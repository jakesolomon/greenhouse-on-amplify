import { useState } from 'react';
import { useForm } from '@mantine/form';
import {TextInput, Textarea, Button, Group, Notification, useMantineTheme} from '@mantine/core';
import { generateClient } from "aws-amplify/api";

import { Schema } from "../../amplify/data/resource.ts";

const ContactForm = () => {
  const [submissionState, setSubmissionState] = useState<'ready'|'sending'|'sent'|'error'>('ready');

  const theme = useMantineTheme();

  const amplifyClient = generateClient<Schema>()

  const form = useForm({
    initialValues: {
      email: '',
      subject: '',
      message: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email address.'),
      subject: (value) => (
        value.trim().length === 0 ? 'Subject is required.' :
        value.trim().length > 500 ? `${value.trim().length} characters. Exceeds max of 500.` : null
      ),
      message: (value) => (
        value.trim().length === 0 ? 'Message is required.' :
          value.trim().length > 500 ? `${value.trim().length} characters. Exceeds max of 500.` : null
      ),
    },
  });

  const handleSubmit = async (values: {email: string, subject: string, message: string}) => {
    setSubmissionState('sending')
    const result = await amplifyClient.queries.sendContactEmail({
      senderAddress: values.email,
      subject: values.subject,
      senderMessage: values.message
    });
    if (result.errors) {
      setSubmissionState('error')
    } else {
      setSubmissionState('sent')
      form.reset()
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email Address"
          placeholder="your.email@example.com"
          disabled={submissionState !== 'ready'}
          {...form.getInputProps('email')}
        />
        <TextInput
          label="Subject"
          placeholder="Subject"
          mt="md"
          disabled={submissionState !== 'ready'}
          {...form.getInputProps('subject')}
        />
        <Textarea
          label="Message"
          placeholder="Your message"
          mt="md"
          autosize
          minRows={4}
          maxRows={6}
          disabled={submissionState !== 'ready'}
          {...form.getInputProps('message')}
        />
        {(submissionState === "ready" || submissionState === "sending") && (
          <Group mt="md">
            <Button
              type="submit"
              loading={submissionState === "sending"}
              onSubmit={(e) => e.preventDefault()}
              color={theme.colors.green[7]}
            >
              Send Message
            </Button>
          </Group>
        )}
        {submissionState === "sent" && (
          <Notification mt='md' withCloseButton={false} color="teal" title="Your message has been sent!" >
            We'll respond to any customer service requests in 1-3 business days.
          </Notification>
        )}
        {submissionState === "error" && (
          <Notification mt='md' withCloseButton={false} color="red" title="An error occurred" >
            Please reload the page and try again.
          </Notification>
        )}
      </form>
    </>
  );
}

export default ContactForm;
