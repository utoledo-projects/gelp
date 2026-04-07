/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import Page from '@/app/auth/refresh/page'

jest.mock('@/components/util/RefreshToken', () => () => <div data-testid="refresh-token">Refresh Token</div>)

describe('Refresh page', () => {
  it('renders the refresh token utility component', () => {
    render(<Page />)

    expect(screen.getByTestId('refresh-token')).toBeInTheDocument()
  })

  it('renders a wrapper div as the top-level element', () => {
    const { container } = render(<Page />)

    expect(container.firstChild?.nodeName).toBe('DIV')
  })
})

