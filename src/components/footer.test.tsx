import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'

vi.mock('@sentry/react', () => ({
  captureMessage: vi.fn(),
  showReportDialog: vi.fn(),
}))

import Footer from './footer'

const renderFooter = () =>
  render(
    <MemoryRouter>
      <MantineProvider>
        <Footer />
      </MantineProvider>
    </MemoryRouter>
  )

describe('Footer', () => {
  it('renders Learn section links', () => {
    renderFooter()
    expect(screen.getByText('FAQ').closest('a')).toHaveAttribute('href', '/faq')
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about')
    expect(screen.getByText('Blog').closest('a')).toHaveAttribute('href', '/learn')
  })

  it('renders Support section links', () => {
    renderFooter()
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact')
    expect(screen.getByText('Privacy Policy').closest('a')).toHaveAttribute('href', '/privacy')
    expect(screen.getByText('Cookie Policy').closest('a')).toHaveAttribute('href', '/cookies')
  })

  it('renders Report an Issue button', () => {
    renderFooter()
    expect(screen.getByText('Report an Issue')).toBeInTheDocument()
  })
})
