/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

// Provide a concrete mock factory to avoid loading the real getUser module.
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
import AdminLayout from '@/app/admin/layout'

const cookiesMock = cookies as jest.MockedFunction<typeof cookies>
const getUserMock = getUser as jest.MockedFunction<typeof getUser>

describe('Admin layout', () => {
  const getCookieMock = jest.fn()

  const renderAdminLayout = async () => {
    const ui = await AdminLayout({
      children: <div data-testid="admin-content">Admin Content</div>,
    })

    return render(ui)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    getCookieMock.mockReset()
    cookiesMock.mockResolvedValue({ get: getCookieMock } as never)
  })

  it('redirects to refresh when the user is not authenticated', async () => {
    getCookieMock.mockReturnValue(undefined)
    getUserMock.mockResolvedValue(null)

    await renderAdminLayout()

    expect(screen.getByTestId('redirect')).toHaveAttribute('data-to', '/auth/refresh')
    expect(screen.getByTestId('redirect')).toHaveAttribute('data-append-redirect', 'true')
    expect(getUserMock).toHaveBeenCalledWith(undefined)
  })

  it('redirects non-admin users to home', async () => {
    getCookieMock.mockReturnValue({ value: 'valid-token' })
    getUserMock.mockResolvedValue({ isAdministrator: false } as never)

    await renderAdminLayout()

    expect(screen.getByTestId('redirect')).toHaveAttribute('data-to', '/')
    expect(screen.getByTestId('redirect')).toHaveAttribute('data-append-redirect', 'false')
    expect(getUserMock).toHaveBeenCalledWith('valid-token')
  })

  it('renders children for admin users', async () => {
    getCookieMock.mockReturnValue({ value: 'admin-token' })
    getUserMock.mockResolvedValue({ isAdministrator: true } as never)

    await renderAdminLayout()

    expect(screen.getByTestId('admin-content')).toBeInTheDocument()
    expect(screen.queryByTestId('redirect')).not.toBeInTheDocument()
    expect(getUserMock).toHaveBeenCalledWith('admin-token')
  })
})
