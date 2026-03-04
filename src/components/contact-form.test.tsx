import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MantineProvider } from '@mantine/core'
import ContactForm from './contact-form'

// ── Mock aws-amplify/api ───────────────────────────────────────────────

const mockSendContactEmail = vi.fn()

vi.mock('aws-amplify/api', () => ({
  generateClient: () => ({
    queries: {
      sendContactEmail: mockSendContactEmail,
    },
  }),
}))

// Also mock the Schema import that contact-form uses
vi.mock('../../amplify/data/resource.ts', () => ({
  Schema: {},
}))

const renderForm = () =>
  render(
    <MantineProvider>
      <ContactForm />
    </MantineProvider>
  )

beforeEach(() => {
  mockSendContactEmail.mockReset()
})

// ── Validation tests ───────────────────────────────────────────────────

describe('ContactForm validation', () => {
  it('shows error for invalid email', async () => {
    const user = userEvent.setup()
    renderForm()
    const emailInput = screen.getByLabelText('Email Address')
    const submitBtn = screen.getByRole('button', { name: /send message/i })

    await user.type(emailInput, 'notanemail')
    await user.click(submitBtn)

    expect(await screen.findByText('Invalid email address.')).toBeInTheDocument()
  })

  it('accepts valid email format', async () => {
    const user = userEvent.setup()
    renderForm()
    const emailInput = screen.getByLabelText('Email Address')
    const subjectInput = screen.getByLabelText('Subject')
    const messageInput = screen.getByLabelText('Message')
    const submitBtn = screen.getByRole('button', { name: /send message/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(subjectInput, 'Hello')
    await user.type(messageInput, 'A message')

    mockSendContactEmail.mockResolvedValueOnce({ data: JSON.stringify({ success: true }), errors: null })
    await user.click(submitBtn)

    // Should NOT show email error
    expect(screen.queryByText('Invalid email address.')).not.toBeInTheDocument()
  })

  it('shows error when subject is empty', async () => {
    const user = userEvent.setup()
    renderForm()
    const submitBtn = screen.getByRole('button', { name: /send message/i })

    await user.type(screen.getByLabelText('Email Address'), 'test@example.com')
    await user.type(screen.getByLabelText('Message'), 'A message')
    await user.click(submitBtn)

    expect(await screen.findByText('Subject is required.')).toBeInTheDocument()
  })

  it('shows error when message is empty', async () => {
    const user = userEvent.setup()
    renderForm()
    const submitBtn = screen.getByRole('button', { name: /send message/i })

    await user.type(screen.getByLabelText('Email Address'), 'test@example.com')
    await user.type(screen.getByLabelText('Subject'), 'Hello')
    await user.click(submitBtn)

    expect(await screen.findByText('Message is required.')).toBeInTheDocument()
  })
})

// ── Submission tests ───────────────────────────────────────────────────

describe('ContactForm submission', () => {
  const fillAndSubmit = async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText('Email Address'), 'test@example.com')
    await user.type(screen.getByLabelText('Subject'), 'Test Subject')
    await user.type(screen.getByLabelText('Message'), 'Test message body')
    await user.click(screen.getByRole('button', { name: /send message/i }))
  }

  it('shows success notification on successful submission', async () => {
    mockSendContactEmail.mockResolvedValueOnce({
      data: JSON.stringify({ success: true }),
      errors: null,
    })

    await fillAndSubmit()

    await waitFor(() => {
      expect(screen.getByText('Your message has been sent!')).toBeInTheDocument()
    })
  })

  it('shows error notification on API error', async () => {
    mockSendContactEmail.mockResolvedValueOnce({
      data: null,
      errors: [{ message: 'Network error' }],
    })

    await fillAndSubmit()

    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument()
    })
  })
})
