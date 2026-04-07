/**
 * @jest-environment jsdom
 */

import { render, waitFor } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import RefreshToken from '@/components/util/RefreshToken'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

describe('RefreshToken', () => {
  const replaceMock = jest.fn()
  const fetchMock = jest.fn()

  const useRouterMock = useRouter as jest.MockedFunction<typeof useRouter>
  const useSearchParamsMock = useSearchParams as jest.MockedFunction<typeof useSearchParams>

  beforeEach(() => {
    jest.clearAllMocks()
    useRouterMock.mockReturnValue({ replace: replaceMock } as never)
    useSearchParamsMock.mockReturnValue(new URLSearchParams() as never)
    global.fetch = fetchMock as never
  })

  it('refreshes and redirects to redirect param on 200 response', async () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams('redirect=/ratings') as never)
    fetchMock.mockResolvedValue({ status: 200 } as Response)

    const { container } = render(<RefreshToken />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })
      expect(replaceMock).toHaveBeenCalledWith('/ratings')
    })
    expect(container.firstChild).toBeNull()
  })

  it('redirects to root on successful refresh without redirect param', async () => {
    fetchMock.mockResolvedValue({ status: 200 } as Response)

    render(<RefreshToken />)

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/')
    })
  })

  it('redirects to login with current params when refresh fails', async () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams('redirect=/ratings&reason=expired') as never)
    fetchMock.mockResolvedValue({ status: 401 } as Response)

    render(<RefreshToken />)

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/auth/login?redirect=%2Fratings&reason=expired')
    })
  })

  it('redirects to login when refresh throws', async () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams('redirect=/ratings') as never)
    fetchMock.mockRejectedValue(new Error('network'))

    render(<RefreshToken />)

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/auth/login?redirect=%2Fratings')
    })
  })
})

