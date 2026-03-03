import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import Header from './header'

const renderHeader = (initialRoute = '/') =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <MantineProvider>
        <Header navBarIsOpen={false} toggleNavBar={() => {}} />
      </MantineProvider>
    </MemoryRouter>
  )

describe('Header', () => {
  it('renders logo linking to /', () => {
    renderHeader()
    const logo = screen.getByAltText('logo')
    expect(logo.closest('a')).toHaveAttribute('href', '/')
  })

  it('renders nav items with correct links', () => {
    renderHeader()
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact')
    expect(screen.getByText('FAQ').closest('a')).toHaveAttribute('href', '/faq')
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about')
    expect(screen.getByText('Learn').closest('a')).toHaveAttribute('href', '/learn')
  })

  it('renders My Plan button linking to /planner', () => {
    renderHeader('/')
    expect(screen.getByText('My Plan').closest('a')).toHaveAttribute('href', '/planner')
  })

  it('hides My Plan button when on /planner', () => {
    renderHeader('/planner')
    expect(screen.queryByText('My Plan')).not.toBeInTheDocument()
  })
})
