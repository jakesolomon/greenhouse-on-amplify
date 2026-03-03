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
})
