/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import FeedBody from '@/components/feed/FeedBody'

describe('FeedBody', () => {
  it('renders the title and description', () => {
    render(<FeedBody title="Cyberpunk 2077" description="A futuristic RPG" score={90} reviewCount={1000} />)
    
    expect(screen.getByText('Cyberpunk 2077')).toBeInTheDocument()
    expect(screen.getByText('A futuristic RPG')).toBeInTheDocument()
  })

  it('renders the badge when type is provided', () => {
    render(<FeedBody title="Title" description="Desc" score={80} reviewCount={50} type="popular" />)
    expect(screen.getByText('popular')).toBeInTheDocument()
  })

  it('formats the review count correctly', () => {
    render(<FeedBody title="Title" description="Desc" score={85.5} reviewCount={1500} />)
    expect(screen.getByText('(1,500 ratings)')).toBeInTheDocument()
    expect(screen.getByText('85.5')).toBeInTheDocument()
  })
  
  it('renders partial stars correctly', () => {
    render(
      <FeedBody 
        title="T" 
        description="D" 
        score={9}
        reviewCount={10} 
      />
    )
    
    const stars = document.querySelectorAll('svg')
    expect(stars.length).toBe(6) 
  })

  it('uses fallback badge color for unknown type', () => {
    render(
      <FeedBody 
        title="Test" 
        description="Desc" 
        score={8} 
        reviewCount={10} 
        type={"unknown" as any} 
      />
    )

    const badge = screen.getByText('unknown')
    expect(badge.className).toContain('bg-zinc-700')
  })
})