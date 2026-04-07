/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import FeedReviewPost from '@/components/feed/FeedReviewPost'

const mockUser = { username: 'ReviewerX' } as any

describe('FeedReviewPost', () => {
  it('renders the reviewer name, game, and review content', () => {
    render(
      <FeedReviewPost 
        user={mockUser} 
        game="Halo" 
        review="Masterpiece!" 
        score={10} 
      />
    )
    
    expect(screen.getByText('ReviewerX')).toBeInTheDocument()
    expect(screen.getByText('Halo')).toBeInTheDocument()
    expect(screen.getByText('Masterpiece!')).toBeInTheDocument()
  })

  it('renders star rating with partial fill', () => {
    render(
      <FeedReviewPost 
        user={mockUser} 
        game="Halo" 
        review="Great!" 
        score={9}
      />
    )

    const stars = document.querySelectorAll('svg')
    expect(stars.length).toBe(6)
  })

  it('renders empty stars when score is low', () => {
    render(
      <FeedReviewPost 
        user={mockUser} 
        game="Halo" 
        review="Meh" 
        score={2}
      />
    )

    const stars = document.querySelectorAll('svg')
    expect(stars.length).toBe(5)
  })
})