/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import FeedPost from '@/components/feed/FeedPost'

describe('FeedPost', () => {
  it('renders both the image and the body content', () => {
    render(
      <FeedPost 
        title="Witcher 3" 
        description="Great game" 
        feedImage="/witcher.jpg" 
        score={95} 
        reviewCount={200} 
      />
    )
    
    expect(screen.getByRole('img')).toHaveAttribute('src', '/witcher.jpg')
    expect(screen.getByText('Witcher 3')).toBeInTheDocument()
    expect(screen.getByText('Great game')).toBeInTheDocument()
  })
})