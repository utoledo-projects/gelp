/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import FeedFriendActivity from '@/components/feed/FeedFriendActivity'

const mockUser = {
  username: 'GamerJoe',
  avatar: 'https://example.com/avatar.jpg'
} as any

describe('FeedFriendActivity', () => {
  it('renders the username and the game title', () => {
    render(<FeedFriendActivity user={mockUser} game="Elden Ring" />)
    
    expect(screen.getByText('GamerJoe')).toBeInTheDocument()
    expect(screen.getByText('Elden Ring')).toBeInTheDocument()
    expect(screen.getByText(/added/i)).toBeInTheDocument()
  })

  it('renders the avatar with correct alt text', () => {
    render(<FeedFriendActivity user={mockUser} game="Elden Ring" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'GamerJoe')
  })

  it('uses fallback avatar when none provided', () => {
    const user = { username: 'NoAvatar' } as any

    render(<FeedFriendActivity user={user} game="Halo" />)

    const img = screen.getByRole('img')
    expect(img.getAttribute('src')).toContain('ui-avatars.com')
  })
})