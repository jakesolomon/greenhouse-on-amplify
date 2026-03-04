import { render, screen } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import CropList from './crop-list'
import type { Crop } from '../types'

// ── generateAffiliateLink tests ────────────────────────────────────────
// The function is private to the component, so we test it indirectly
// by rendering a crop with a storeHandle and inspecting the link href.

const makeCrop = (overrides: Partial<Crop> = {}): Crop => ({
  name: 'Beet',
  variety: 'Detroit Dark Red',
  shortDescription: 'A classic beet.',
  storeHandle: 'beet-detroit-dark-red-vegetable-seeds',
  optimalGrowingDateRanges: [],
  frostHardy: true,
  directSow: true,
  guidance: '',
  lowerTempBound: 40,
  upperTempBound: 85,
  ...overrides,
})

const renderCropList = (crops: Crop[]) =>
  render(
    <MantineProvider>
      <CropList crops={crops} />
    </MantineProvider>
  )

describe('CropList — affiliate links', () => {
  it('generates a correctly encoded affiliate link', () => {
    renderCropList([makeCrop()])
    const link = screen.getByRole('link', { name: /buy seeds/i })
    const href = link.getAttribute('href')!
    expect(href).toContain('https://www.pjtra.com/t/8-11415-363806-153185?url=')
    expect(href).toContain(encodeURIComponent('https://trueleafmarket.com/products/beet-detroit-dark-red-vegetable-seeds'))
  })

  it('encodes special characters in storeHandle', () => {
    renderCropList([makeCrop({ storeHandle: 'herb-with spaces&more' })])
    const link = screen.getByRole('link', { name: /buy seeds/i })
    const href = link.getAttribute('href')!
    expect(href).toContain(encodeURIComponent('https://trueleafmarket.com/products/herb-with spaces&more'))
  })

  it('does not render a Buy Seeds link when storeHandle is absent', () => {
    renderCropList([makeCrop({ storeHandle: undefined })])
    expect(screen.queryByRole('link', { name: /buy seeds/i })).not.toBeInTheDocument()
  })
})
