/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import RegisterForm from '@/components/forms/RegisterForm'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('RegisterForm', () => {
  const pushMock = jest.fn()
  const fetchMock = jest.fn()

  const useRouterMock = useRouter as jest.MockedFunction<typeof useRouter>

  beforeEach(() => {
    jest.clearAllMocks()
    useRouterMock.mockReturnValue({ push: pushMock } as never)
    global.fetch = fetchMock as never
  })

  const fillValidForm = () => {
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'valid_user' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } })
    fireEvent.change(screen.getByLabelText('Confirm Email'), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'verystrongpw' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'verystrongpw' },
    })
  }

  it('shows mismatch validation issues and keeps submit disabled', async () => {
    render(<RegisterForm />)

    const submit = screen.getByRole('button', { name: 'Register' })
    expect(submit).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } })
    fireEvent.change(screen.getByLabelText('Confirm Email'), { target: { value: 'different@example.com' } })

    expect(await screen.findByText('Email addresses do not match')).toBeInTheDocument()
    expect(submit).toBeDisabled()
  })

  it('submits valid registration and redirects to login', async () => {
    fetchMock.mockResolvedValue({ status: 201 } as Response)
    render(<RegisterForm />)

    fillValidForm()
    fireEvent.click(screen.getByRole('button', { name: 'Register' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'valid_user',
          email: 'user@example.com',
          password: 'verystrongpw',
        }),
      })
      expect(pushMock).toHaveBeenCalledWith('/auth/login')
    })
  })

  it('shows API error message when registration fails', async () => {
    fetchMock.mockResolvedValue({
      status: 409,
      json: async () => ({ message: 'Username already exists' }),
    } as Response)
    render(<RegisterForm />)

    fillValidForm()
    fireEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByText('Username already exists')).toBeInTheDocument()
    expect(pushMock).not.toHaveBeenCalled()
  })
})

