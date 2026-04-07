/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('@/actions/getUser', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/components/util/Redirect', () => ({
  __esModule: true,
  default: ({ to, appendRedirect }: { to: string; appendRedirect?: boolean }) => (
    <div
      data-testid="redirect"
      data-to={to}
      data-append-redirect={appendRedirect ? 'true' : 'false'}
    />
  ),
}))

import getUser from '@/actions/getUser'
import AuthenticatedLayout from '@/app/(authenticated)/layout'

const cookiesMock = cookies as jest.MockedFunction<typeof cookies>
const getUserMock = getUser as jest.MockedFunction<typeof getUser>

describe('Authenticated layout', () => {
  const getCookieMock = jest.fn()

  const renderAuthenticatedLayout = async () => {
    const ui = await AuthenticatedLayout({
      children: <div data-testid="authenticated-content">Authenticated Content</div>,
    })

    return render(ui)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    getCookieMock.mockReset()
    cookiesMock.mockResolvedValue({ get: getCookieMock } as never)
  })

  it('redirects to refresh when no access token is present', async () => {
    getCookieMock.mockReturnValue(undefined)
    getUserMock.mockResolvedValue(null)

    await renderAuthenticatedLayout()

    expect(screen.getByTestId('redirect')).toHaveAttribute('data-to', '/auth/refresh')
    expect(screen.getByTestId('redirect')).toHaveAttribute('data-append-redirect', 'true')
    expect(getUserMock).toHaveBeenCalledWith(undefined)
  })

  it('redirects to refresh when token is invalid', async () => {
    getCookieMock.mockReturnValue({ value: 'invalid-token' })
    getUserMock.mockResolvedValue(null)

    await renderAuthenticatedLayout()

    expect(screen.getByTestId('redirect')).toHaveAttribute('data-to', '/auth/refresh')
    expect(screen.getByTestId('redirect')).toHaveAttribute('data-append-redirect', 'true')
    expect(getUserMock).toHaveBeenCalledWith('invalid-token')
  })

  it('renders children when the user is logged in', async () => {
    getCookieMock.mockReturnValue({ value: 'valid-token' })
    getUserMock.mockResolvedValue({ _id: 'u1' } as never)

    await renderAuthenticatedLayout()

    expect(screen.getByTestId('authenticated-content')).toBeInTheDocument()
    expect(screen.queryByTestId('redirect')).not.toBeInTheDocument()
    expect(getUserMock).toHaveBeenCalledWith('valid-token')
  })
})

