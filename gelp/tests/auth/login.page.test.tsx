/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import Page from '@/app/(unauthenticated)/auth/login/page'

jest.mock('@/components/forms/LoginForm', () => () => <div data-testid="login-form">Login Form</div>)

describe('Login page', () => {
  it('renders the login form', () => {
    render(<Page />)

    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })

  it('uses the expected page wrapper classes', () => {
    const { container } = render(<Page />)

    expect(container.firstChild).toHaveClass('flex', 'items-center', 'justify-center', 'h-screen')
  })
})

