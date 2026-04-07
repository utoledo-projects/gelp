/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import FeedImage from '@/components/feed/FeedImage'

describe('FeedImage', () => {
  it('renders the image with the provided src and alt text', () => {
    render(<FeedImage src="/test-game.jpg" alt="Test Game" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/test-game.jpg')
    expect(img).toHaveAttribute('alt', 'Test Game')
  })

  it('uses the placeholder image if src is empty', () => {
    render(<FeedImage src="" alt="Test Game" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/placeholder-game.jpg')
  })
})