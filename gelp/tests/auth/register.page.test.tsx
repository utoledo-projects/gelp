/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import Page from '@/app/auth/register/page'

jest.mock('@/components/forms/RegisterForm', () => () => <div data-testid="register-form">Register Form</div>)

describe('Register page', () => {
  it('renders the register form', () => {
    render(<Page />)

    expect(screen.getByTestId('register-form')).toBeInTheDocument()
  })

  it('uses the expected page wrapper classes', () => {
    const { container } = render(<Page />)

    expect(container.firstChild).toHaveClass('flex', 'items-center', 'justify-center', 'h-screen')
  })
})

