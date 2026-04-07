/**
 * @jest-environment jsdom
 */

import { render, waitFor } from '@testing-library/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Redirect from '@/components/util/Redirect'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}))

describe('Redirect', () => {
  const pushMock = jest.fn()

  const useRouterMock = useRouter as jest.MockedFunction<typeof useRouter>
  const usePathnameMock = usePathname as jest.MockedFunction<typeof usePathname>
  const useSearchParamsMock = useSearchParams as jest.MockedFunction<typeof useSearchParams>

  beforeEach(() => {
    jest.clearAllMocks()
    useRouterMock.mockReturnValue({ push: pushMock } as never)
    usePathnameMock.mockReturnValue('/protected' as never)
    useSearchParamsMock.mockReturnValue(new URLSearchParams() as never)
  })

  it('pushes directly to the destination when appendRedirect is false', async () => {
    const { container } = render(<Redirect to='/auth/login' />)

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/auth/login')
    })
    expect(container.firstChild).toBeNull()
  })

  it('appends redirect and preserves existing search params when appendRedirect is true', async () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams('reason=expired') as never)

    render(<Redirect to='/auth/login' appendRedirect />)

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledTimes(1)
    })

    const redirectUrl = pushMock.mock.calls[0][0] as string
    const [path, query = ''] = redirectUrl.split('?')
    const queryParams = new URLSearchParams(query)

    expect(path).toBe('/auth/login')
    expect(queryParams.get('reason')).toBe('expired')
    expect(queryParams.get('redirect')).toBe('/protected?reason=expired')
  })

  it('appends redirect without a trailing query when current params are empty', async () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams() as never)

    render(<Redirect to='/auth/login' appendRedirect />)

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledTimes(1)
    })

    const redirectUrl = pushMock.mock.calls[0][0] as string
    const queryParams = new URLSearchParams(redirectUrl.split('?')[1] ?? '')

    expect(queryParams.get('redirect')).toBe('/protected')
  })
})

