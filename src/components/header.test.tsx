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

  describe('v2 behavior (current, to be removed)', () => {
    it('appends -v2 suffix to nav links when path contains v2', () => {
      renderHeader('/home-v2')
      expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact-v2')
      expect(screen.getByText('FAQ').closest('a')).toHaveAttribute('href', '/faq-v2')
      expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about-v2')
      expect(screen.getByText('Learn').closest('a')).toHaveAttribute('href', '/learn-v2')
    })

    it('logo links to /home-v2 when path contains v2', () => {
      renderHeader('/home-v2')
      const logo = screen.getByAltText('logo')
      expect(logo.closest('a')).toHaveAttribute('href', '/home-v2')
    })
  })
})
