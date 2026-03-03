import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MantineProvider, AppShell } from '@mantine/core'
import NavBar from './navbar'

const renderNavBar = (initialRoute = '/') =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <MantineProvider>
        <AppShell>
          <NavBar toggleNavBar={() => {}} />
        </AppShell>
      </MantineProvider>
    </MemoryRouter>
  )

describe('NavBar', () => {
  it('renders nav items with correct links', () => {
    renderNavBar()
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/home')
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact')
    expect(screen.getByText('FAQ').closest('a')).toHaveAttribute('href', '/faq')
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about')
    expect(screen.getByText('Learn').closest('a')).toHaveAttribute('href', '/learn')
  })

  describe('v2 behavior (current, to be removed)', () => {
    it('appends -v2 suffix to nav links when path contains v2', () => {
      renderNavBar('/home-v2')
      expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/home-v2')
      expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact-v2')
      expect(screen.getByText('FAQ').closest('a')).toHaveAttribute('href', '/faq-v2')
      expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about-v2')
      expect(screen.getByText('Learn').closest('a')).toHaveAttribute('href', '/learn-v2')
    })
  })
})
