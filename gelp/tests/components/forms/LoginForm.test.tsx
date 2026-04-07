/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import LoginForm from '@/components/forms/LoginForm'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

describe('LoginForm', () => {
  const pushMock = jest.fn()
  const fetchMock = jest.fn()

  const useRouterMock = useRouter as jest.MockedFunction<typeof useRouter>
  const useSearchParamsMock = useSearchParams as jest.MockedFunction<typeof useSearchParams>

  beforeEach(() => {
    jest.clearAllMocks()
    useRouterMock.mockReturnValue({ push: pushMock } as never)
    useSearchParamsMock.mockReturnValue({
      has: () => false,
      get: () => null,
    } as never)
    global.fetch = fetchMock as never
  })

  it('enables submit only when username and password are provided', () => {
    render(<LoginForm />)

    const submit = screen.getByRole('button', { name: 'Login' })
    expect(submit).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'user' } })
    expect(submit).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
    expect(submit).toBeEnabled()
  })

  it('submits credentials and redirects to redirect search param on success', async () => {
    useSearchParamsMock.mockReturnValue({
      has: (key: string) => key === 'redirect',
      get: (key: string) => (key === 'redirect' ? '/home' : null),
    } as never)
    fetchMock.mockResolvedValue({ status: 200 } as Response)

    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'user' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'user', password: 'secret' }),
      })
      expect(pushMock).toHaveBeenCalledWith('/home')
    })
  })

  it('shows API error message when login fails', async () => {
    fetchMock.mockResolvedValue({
      status: 401,
      json: async () => ({ error: 'Invalid credentials' }),
    } as Response)

    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'user' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
    expect(pushMock).not.toHaveBeenCalled()
  })
})

