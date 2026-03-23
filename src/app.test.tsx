import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import HomePage from '@/routes/HomePage'

// Smoke test: the home page renders without crashing
describe('HomePage', () => {
  it('renders the app title', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(screen.getByText('GoH Tools')).toBeInTheDocument()
  })
})
